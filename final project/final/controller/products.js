const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../models/products');
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

        let product = new Product(fields);

      

        if (files.photos) {
           
            if (files.photos.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 10mb in size'
                });
            }
            product.photos.data = fs.readFileSync(files.photo.path);
            product.photos.contentType = files.photo.type;
        }

        product.save((err, result) => {
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

