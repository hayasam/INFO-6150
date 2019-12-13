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

        products.save((err, result) => {
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
    products.remove((err, deletedProduct) => {
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