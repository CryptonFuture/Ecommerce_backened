const User = require('../models/Auth')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { redisClient } = require("../config/redis");

const Register = async (req, res) => {

    try {
         const { firstname, lastname, email, password, confirmPass, role } = req.body

    if (!firstname || !lastname || !email || !password || !confirmPass) {
        return res.status(400).json({
            success: false,
            error: 'Please fill out all fields'
        })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid Email'
        })
    }

    const isExistUser = await User.findOne({ email })

    if (isExistUser) {
        return res.status(400).json({
            success: false,
            error: 'Email already exists has been taken'
        })
    } else if (password !== confirmPass) {
        return res.status(400).json({
            success: false,
            error: "Password does'nt match"
        })
    }

    if (password.length < 10 || confirmPass.length < 10) {
        return res.status(400).json({
            success: false,
            error: 'Password must be at least 10 characters long'
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const hashConfirmPass = await bcrypt.hash(confirmPass, 10)

    let imagePath = null;
    if (req.file) {
        imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const user = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashPassword,
        confirmPass: hashConfirmPass,
        role: role,
        image: imagePath
    })

    const userData = await user.save()

    if (userData) {
        return res.status(200).json({
            success: true,
            message: "user create successfully",
            data: userData
        })
    }

    } catch (error) {
        console.log(error);
        
         return res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }

}



const Login = async (req, res) => {
    const { email, password, role } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: '5m'
        });

        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: "5m"
        });

        const users = await User.findOne({ active: user.active })
        const admin = await User.findOne({ is_admin: user.is_admin })

        if (!users.active) {
            return res.status(400).send({
                success: false,
                error: "This account is in-active, please contact your admin",
            });
        }

        if (admin.role === 1 && !admin.is_admin) {
            return res.status(400).send({
                success: false,
                error: "This account is not admin",
            });
        }


        // const logs = new UserLogs({
        //     user_id: user._id,
        //     token: token,
        //     login_time: new Date()
        // })

        // await logs.save()

        if (parseInt(role, 10) !== user.role) {
            return res.status(403).json({
                success: false,
                error: "Role mismatch. Unauthorized login attempt."
            });
        }

        if (![0, 1].includes(user.role)) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized access: invalid role.",
            });
        }

        if (user.role === 0 || user.role === 1) {
            const users = await User.findByIdAndUpdate(
                { _id: user._id },
                { accessToken: accessToken, refreshToken: refreshToken, is_login: 1 },
                { new: true }
            )

            let message = "Login successfully";
            if (user.role === 0) {
                message = "User login successfully";
            } else if (user.role === 1) {
                message = "Admin login successfully";
            }
            await users.save()

            const redisData = {
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    tokenType: "Bearer",
                    active: user.active,
                    role: user.role,
                    is_admin: user.is_admin,
                    image: user.image,
                    is_login: 1,
                    expiryAt: user.expiryAt,
                }
            };

            await redisClient.set(
                `user:${user._id}`,
                JSON.stringify(redisData),
                {
                    EX: 60 * 60 * 24 * 7
                }
            );

           return res.json({
                success: true,
                accessToken,
                refreshToken,
                // expiresAt,
                user: {
                    id: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    tokenType: 'Bearer',
                    active: user.active,
                    role: user.role,
                    is_admin: user.is_admin,
                    image: user.image,
                    is_login: user.is_login,
                    expiryAt: user.expiryAt,
                },
                message: message
            });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
        console.log(err, 'error')
    }
}

module.exports = { Register, Login }
