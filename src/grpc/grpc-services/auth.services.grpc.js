const authController = require("../../controllers/authController");

exports.Register = async (call, callback) => {

    const req = {
        body: call.request,
        file: null
    };

    const res = {
        status() {
            return this;
        },
        json(data) {
            callback(null, {
                success: data.success,
                message: data.message
            });
        }
    };

    await authController.Register(req, res);
};

exports.Login = async (call, callback) => {

    const req = {
        body: call.request
    };

    const res = {
        status() {
            return this;
        },
        json(data) {
            callback(null, {
                success: data.success,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                message: data.message
            });
        }
    };

    await authController.Login(req, res);
};