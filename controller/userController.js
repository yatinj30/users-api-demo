const path = require("path");
const bcrypt = require("bcrypt");
const commonService = require("../service/commonService");
const userService = require("../service/userService");

const saltRound = process.env.SALT_ROUND || 2;

exports.login = async (req, res) => {
    try {
        let usersData = await commonService.readFile(path.join(__dirname, filePath));
        if (usersData && usersData.length) {
            let user = await userService.findByEmail(usersData, req.body.email);
            if (user) {
                if (user.isExpired) {

                    res.status(401).json({
                        success: false,
                        data: {},
                        message: "Your password is expired. Update your password!"
                    });
                }
                const passwordExpiresIn = process.env.PASS_EXPIRES_IN_DAYS;
                let currentDateTime = Date.now();
                let passwordIndex = user.passwords.findWhere(pass => pass.isExpired == false);
                if (passwordIndex > -1) {
                    if (currentDateTime - user.passwords[passwordIndex].createdAt > passwordExpiresIn) {
                        user.passwords[passwordIndex].isExpired = true;
                        await commonService.writeFile(path.join(__dirname, filePath), usersData);

                        res.status(401).json({
                            success: true,
                            data: {},
                            message: "Your password is expired. Update your password!"
                        });
                    }
                    let passwordMatch = await bcrypt.compare(req.body.password, user.passwords[passwordIndex].password);
                    if (passwordMatch) {

                        res.status(200).json({
                            success: true,
                            data: {
                                email: user.email
                            },
                            message: "User Logged In."
                        });
                    } else {

                        res.status(401).json({
                            success: false,
                            data: {},
                            message: "Username or Password Invalid."
                        });
                    }
                } else {

                    res.status(401).json({
                        success: false,
                        data: {},
                        message: "Username or Password Invalid."
                    });
                }
            } else {

                res.status(401).json({
                    success: false,
                    data: {},
                    message: "Username or Password Invalid."
                });
            }
        } else {

            res.status(404).json({
                success: false,
                data: {},
                message: "User not found."
            });
        }
    } catch (error) {

        res.status(400).json({
            success: false,
            data: {},
            message: "Something went wrong! Please try after sometime."
        });
    }
}

exports.signup = async (req, res) => {

}

exports.changePassword = async (req, res) => {

}