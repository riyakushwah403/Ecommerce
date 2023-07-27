const Category = require('../Models/Category');
// const errorHandler = require("../helpers/dbErrorHandler");

exports.categoryById = (req, res, next, id) => {

    Category.findById(id).exec((err, category) => {

        if (err = !category) {

            return res.status(400).json({

                error: "category is does not exit"

            });

        }

        req.category = category

        console.log("req.category++++ ", req.category);

        next();

    });




}


exports.create = (req, res) => {
    const category = new Category(req.body)
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "error"
            });
        }
        res.json({ category });
    });
}
exports.read = (req, res) => {

    return res.json(req.category);

}





exports.update = (req, res) => {




    const category = req.category;

    category.name = req.body.name;

    category.save((err, category) => {

        if (err) {

            return res.status(400).json({

                error: err

            });




        }

        res.json({ category });

    });

}





exports.remove = (req, res) => {




    const category = req.category;

    category.remove((err, category) => {

        if (err) {

            return res.status(400).json({

                error: err

            });

        }

        res.json({

            message: "delete category succesful"

        });

    });




};





exports.list = (req, res) => {




    Category.find().exec((err, category) => {

        if (err) {

            return res.status(400).json({

                error: err

            });

        }

        res.json({ category });

    });

}

