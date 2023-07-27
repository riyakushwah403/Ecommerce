exports.userSignupValidator = (req ,res ,next) =>{
    req.check('name','Name is required').notEmpty();
    req.check('email', 'Email must be  between 4 to 32 characters ')
    .matches(/.+\@.+\..+/)
    .withMessage('Email ust be contain @')
    .isLength({
        min:4 , max:32
    });
     req.check('password' , 'password is required').notEmpty()

     req.check('password')
     .isLength({min: 6})
     .withMessage('password contain at least 6 characters')
     .matches(/\d/)
     .withMessage('password must contain number');
     const errors = req.validationErrors()
     if(errors){
        const firsterror = errors.map( error => error.msg)[0];
        return res.status(400).json({error:firsterror})
     }
     next();

    };
