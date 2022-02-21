const path = require("path");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const commonService = require("../service/commonService");
const userService = require("../service/userService");

exports.login = async (req, res) => {
    try {
        const fullPath = path.join(__dirname, "../", process.env.FILE_PATH);
        let usersData = await commonService.readFile(fullPath);
        if (usersData && usersData.length) {
            let user = await userService.findByEmail(usersData, req.body.email);
            if (user) {
                let passwordIndex = user.passwords.length - 1;
                if (user.passwords[passwordIndex].isExpired) {

                    return res.status(401).json({
                        success: false,
                        data: {},
                        message: "Your password is expired. Update your password!"
                    });
                }
                const passwordExpiresIn = parseInt(process.env.PASS_EXPIRES_IN_DAYS);
                let currentDateTime = Date.now();
                if (passwordIndex > -1) {
                    if (Math.floor((currentDateTime - user.passwords[passwordIndex].createdAt) / 1000 / 60 / 60 / 24) > passwordExpiresIn) {
                        user.passwords[passwordIndex].isExpired = true;
                        await commonService.writeFile(fullPath, usersData);

                        return res.status(401).json({
                            success: false,
                            data: {},
                            message: "Your password is expired. Update your password!"
                        });
                    }
                    let passwordMatch = await bcrypt.compare(req.body.password, user.passwords[passwordIndex].password);
                    if (passwordMatch) {

                        return res.status(200).json({
                            success: true,
                            data: {
                                email: user.email
                            },
                            message: "User Logged In."
                        });
                    } else {

                        return res.status(401).json({
                            success: false,
                            data: {},
                            message: "Username or Password Invalid."
                        });
                    }
                } else {

                    return res.status(401).json({
                        success: false,
                        data: {},
                        message: "Username or Password Invalid."
                    });
                }
            } else {

                return res.status(401).json({
                    success: false,
                    data: {},
                    message: "Username or Password Invalid."
                });
            }
        } else {

            return res.status(404).json({
                success: false,
                data: {},
                message: "User not found."
            });
        }
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            success: false,
            data: {},
            message: "Something went wrong! Please try after sometime."
        });
    }
}

exports.signup = async (req, res) => {
    try {
        const fullPath = path.join(__dirname, "../", process.env.FILE_PATH);
        let usersData = await commonService.readFile(fullPath);
        if (usersData && usersData.length) {
            let user = await userService.findByEmail(usersData, req.body.email);
            if (user) {

                return res.status(401).json({
                    success: false,
                    data: {},
                    message: "User already registed! Try to login."
                });
            }
        }
        if (usersData == null) usersData = [];
        const saltRound = process.env.SALT_ROUND || 2;
        let userData = {
            "_id": uuid.v1(),
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "passwords": [
                {
                    "_id": uuid.v1(),
                    "password": bcrypt.hashSync(req.body.password, parseInt(saltRound)),
                    "createdAt": Date.now(),
                    "isExpired": false
                }
            ]
        }
        usersData.push(userData);
        await commonService.writeFile(fullPath, usersData);

        return res.status(200).json({
            success: true,
            data: {
                email: req.body.email
            },
            message: "User Registered."
        });
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            success: false,
            data: {},
            message: "Something went wrong! Please try after sometime."
        });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const fullPath = path.join(__dirname, "../", process.env.FILE_PATH);
        let usersData = await commonService.readFile(fullPath);
        if (usersData && usersData.length) {
            let user = await userService.findByEmail(usersData, req.body.email);
            if (!user) {

                return res.status(404).json({
                    success: false,
                    data: {},
                    message: "User not found."
                });
            }
            let passwordIndex = user.passwords.findIndex(pass => pass.isExpired == false);
            passwordIndex = passwordIndex == -1 ? user.passwords.length - 1 : passwordIndex;

            let passwordMatch = await bcrypt.compare(req.body.password, user.passwords[passwordIndex].password);
            if (!passwordMatch) {

                return res.status(401).json({
                    success: false,
                    data: {},
                    message: "Username or Password Invalid."
                });
            }

            let j = 0;
            let isNewPasswordSameAsOld = false;
            for (let i = user.passwords.length - 1; i >= 0; i--) {
                j++;
                if (j == process.env.PASS_NOT_RECENTLY_USED + 1) break;
                let passwordMatch = await bcrypt.compare(req.body.newPassword, user.passwords[i].password);
                if (passwordMatch) {
                    isNewPasswordSameAsOld = true;
                    break;
                }
            }
            if (isNewPasswordSameAsOld) {

                return res.status(401).json({
                    success: false,
                    data: {},
                    message: "New Password should not be same as Old Password."
                });
            }

            const saltRound = process.env.SALT_ROUND || 2;
            user.passwords.map(e => e.isExpired = true);
            user.passwords.push({
                "_id": uuid.v1(),
                "password": bcrypt.hashSync(req.body.newPassword, parseInt(saltRound)),
                "createdAt": Date.now(),
                "isExpired": false
            });
            await commonService.writeFile(fullPath, usersData);

            return res.status(200).json({
                success: true,
                data: {
                    email: req.body.email
                },
                message: "Password updated."
            });
        }
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            success: false,
            data: {},
            message: "Something went wrong! Please try after sometime."
        });
    }
}