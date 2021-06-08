let moongooseUtils = {

    mongooseErrorHandler: function (error, data) {
        let errorNameAndErrorCode = moongooseUtils.getErrorNameAndErrorCode(error, data);
        return errorNameAndErrorCode;
    },

    getErrorNameAndErrorCode: function (error, data) {
        let message;
        if (error.name === 'ValidationError' || error.name === 'MongoError') {
            if (error.name === 'ValidationError') {
                message = moongooseUtils.getErrorMessage(error);
            }
            if (error.name === 'MongoError') {
                if (error.code === 11000) {
                    message = data + ' already exist';
                }
            }
        } else {
            message = error
        }
        return message;
    },

    getErrorMessage: function (err) {
        if (err.errors) {
            const error = {};
            let message = '';
            const keys = Object.keys(err.errors);
            const singleKey = keys[0];
            message = err.errors[singleKey].message;
            keys.forEach((key) => {
                let message = err.errors[key].message;
                if (err.errors[key].properties && err.errors[key].properties.message) {
                    message = err.errors[key].properties.message.replace('`{PATH}`', key);
                }
                message = message.replace('Path ', '').replace(key, '').trim();
                error[key] = message;
            });
            return message;
        }
    }
}

module.exports = moongooseUtils;

