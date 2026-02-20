export const validatorMiddleware = (schema, property = "body") => (req, res, next) => {
    const joiObject = schema[property]; 
    const data = req[property];

    const { error, value } = joiObject.validate(data);

    if (error) {
        return res.status(400).json({
            message: "Validation Error",
            details: error.details.map(d => d.message) 
        });
    }

    // Cập nhật lại dữ liệu đã qua xử lý (trim, convert type...)
    req[property] = value;
    next();
};