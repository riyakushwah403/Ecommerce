const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Product = require('../Models/Product');
const { Query } = require('mongoose');
// const { resolveAny } = require('dns');

exports.productById = (req, res, next, id) => {
  Product.findById(id)
  .populate('category')
  .exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Product not found"
      });
    }
    req.product = product;
    next();
  });
};

exports.read = (req, res) => {

  return res.json(req.product);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    const { name, description, price, category, quantity, shipping } = fields
    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({
        error: "provide all filed",
      });
    }
    for (const key in fields) {
      if (Object.hasOwnProperty.call(fields, key)) {
        if (key == "name" || key == "description" || key == "category") {
          fields[key] = fields[key].join()
        } else if (key == "price" || key == "quantity") {
          fields[key] = Number(fields[key].join())
        } else {
          fields[key] = Boolean(fields[key].join())
        }
      }
    }
    let product = new Product(fields)
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      // console.log("files",files);
      const filePath = files.photo.map(item => { return item.filepath });
      const mimetype = files.photo.map(item => { return item.mimetype });
      console.log("filePath", filePath, "mimetype", mimetype);
      product.photo.data = fs.readFileSync(...filePath); // change path to filepath
      product.photo.contentType = mimetype.join(); // change typt to mimetype
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(result);
    });
  });
}
exports.remove = (req, res) => {
  let product = req.product
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({

      message: "product delete succsfully"
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtension = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded"
      });
    }
    // const { name, description, price, category, quantity, shipping } = fields
    // if (!name || !description || !price || !category || !quantity || !shipping) {
    //   return res.status(400).json({
    //     error: "provide all filed",
    //   });
    // }
    for (const key in fields) {
      if (Object.hasOwnProperty.call(fields, key)) {
        if (key == "name" || key == "description" || key == "category") {
          fields[key] = fields[key].join()
        } else if (key == "price" || key == "quantity") {
          fields[key] = Number(fields[key].join())
        } else {
          fields[key] = Boolean(fields[key].join())
        }
      }
    }
    let product = req.product
    product = _.extend(product, fields)
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      const filePath = files.photo.map(item => { return item.filepath });
      const mimetype = files.photo.map(item => { return item.mimetype });
      console.log("filePath", filePath, "mimetype", mimetype);
      product.photo = fs.readFileSync(...filePath); // change path to filepath
      product.photo.contentType = mimetype; // change typt to mimetype
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(result);
    });
  });
}


// sell and arrival
//by sell = /products?sortBy=sold&order=desc&limit=4

//by arrival = /products?sortBy=createAt&order=desc&limit=4
//if no param  are sent all product are return


exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc"
  let sortBy = req.query.sortBy ? req.query.sortBy : "id"
  let limit = req.query.limit ? parseInt(req.query.limit) : 5

  Product.find()
    // .select("-photo")
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "product does not found"
        });
      }else{
      res.json({ products });
      }
    })
}

/**
 * it will find the product based on request product category
 * other product that has the same category , wiil be return
 * 
 */

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 5
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    // .select("-photo")
    .limit(limit)
    .populate('category', 'id name')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
else{
  res.json({ products });

}
    })

}



exports.listCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "categories not found"
      });
    }
    res.json({ categories });
  });
}



/**
* list products by search
* we will implement product search in react frontend
* we will show categories in checkbox and price range in radio buttons
* as the user clicks on those checkbox and radio buttons
* we will make api request and show the products to users based on what he wants
*/


exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  // let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte - greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
     .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    // .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found"
        });
      }
      res.json({
        size: data.length,
        data
      });
    });
};



exports.photo = (req, res, next) =>{
  console.log("reqested productd>>>><<<<<<<<<",req.product)
  console.log("photo.....................",req.product.photo.data)
  if(req.product.photo.data){
  
    res.set('Content-Type', req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next();
};
//create query object to hold search  value and categoy value
exports.listSearch =(req,res)=>{
 const query = {}
 console.log("req.query.search",req.query.search);
 if(req.query.search){
  query.name ={$regex: req.query.search, $options:'i'}

  if(req.query.category && req.query.category != 'All'){
    query.category = req.query.category
  }

  Product.find(query,(err,products) =>{
    if(err) {
      return res.status(400).json({
        error:err
      })
    }
    res.json(products)
  })
 }

}

exports.decreaseQuantity =(req,res,next) =>{
  let bulkOps = req.body.order.products.map( (item) =>{
    return{
      updateOne: {
        filter :{_id: item._id},
        update:{$inc: {quantity: -item.count, sold: +item.count}}
      }
    }
  })

  Product.bulkWrite(bulkOps,{},(error,products)=>{
    if(error){
      return res.status(400).json({
        error:'could npt update product'
      })
    } res.json(products)
  })
  next()
}