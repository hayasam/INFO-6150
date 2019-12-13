const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Products = require('../models/products');
const { errorHandler } = require('../helper/dbErrorHandler');


exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photos could not be uploaded'
            });
        }

        let products = new Products(fields);

      

        if (files.photos) {
           
            if (files.photos.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 10mb in size'
                });
            }
            products.photos.data = fs.readFileSync(files.photos.path);
            products.photos.contentType = files.photos.type;
        }
        const { name, description, price, category, quantity, shipping } = fields;

        if (!name || !description || !price || !category || !quantity || !shipping) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        Products.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });

    });
};

exports.productById = (req, res, next, id) => {
    Products.findById(id)
        .populate('category')
        .exec((err, products) => {
            if (err || !products) {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }
            req.products = products;
            next();
        });
};
exports.read = (req, res) => {
    req.products.photos = undefined;
    return res.json(req.products);
};
exports.remove = (req, res) => {
    let products = req.products;
    Products.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Product deleted successfully'
        });
    });
};
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let products = req.products;
        products = _.extend(products, fields);

    
        if (files.photo) {
            
            if (files.photos.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            products.photos.data = fs.readFileSync(files.photos.path);
            products.photos.contentType = files.photos.type;
        }

        products.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};
exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Products.find()
        .select('-photos')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Products.find({ _id: { $ne: req.products }, category: req.products.category })
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

exports.listCategories = (req, res) => {
    Products.distinct('category', {}, (err, categories) => {
        if (err) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        }
        res.json(categories);
    });
};

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};


    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Products.find(findArgs)
        .select('-photos')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};
exports.photo = (req, res, next) => {
    if (req.products.photos.data) {
        res.set('Content-Type', req.products.photos.contentType);
        return res.send(req.products.photos.data);
    }
    next();
};

exports.listSearch = (req, res) => {
    const query = {};
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        Products.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }
};

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    });
};