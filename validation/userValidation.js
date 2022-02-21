const Joi = require("joi");
require("dotenv").config();

// not working
// const passRegExpression = `(?=(?:.*[a-z]),{${process.env.PASS_LOWERCASE_CHAR}})(?=(?:.*[A-Z]),{${process.env.PASS_UPPERCASE_CHAR}})(?=(?:.*\d),{${process.env.PASS_DIGITS}})(?=(?:.*[@$!%*?&]),{${process.env.PASS_SPECIAL_CHAR}})[A-Za-z\d@$!%*?&]{${process.env.PASS_MIN_LENGTH}}$`;
// accept everything as per given criteria but it's static
const passRegExpression = `(?=.*[0-9])(?=.*[!@#\$%\^\&*\)\(+=._-])(?=.*[A-Z])([a-zA-Z0-9]+).{8,}$`;

exports.loginValidation = async (req, res, next) => {
    try {
        const userLogIn = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().regex(RegExp(passRegExpression)).required()
        });

        await userLogIn.validateAsync(req.body);
        next();

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            success: false,
            data: {},
            message: "Bad Request"
        });
    }
};

exports.signUpValidation = async (req, res, next) => {
    try {
        const userSignUp = Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(RegExp(passRegExpression)).required()
        });

        await userSignUp.validateAsync(req.body);
        next();

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            success: false,
            data: {},
            message: "Bad Request"
        });
    }
};

exports.changePasswordValidation = async (req, res, next) => {
    try {
        const userPassword = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().regex(RegExp(passRegExpression)).required(),
            newPassword: Joi.string().regex(RegExp(passRegExpression)).required()
        });

        await userPassword.validateAsync(req.body);
        next();

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            success: false,
            data: {},
            message: "Bad Request"
        });
    }
};
