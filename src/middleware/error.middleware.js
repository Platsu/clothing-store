function errorMiddleware(err, req, res, next) {
    res.status(err.status || 500).json({
        error: {
            code: err.code || "INTERNAL_SERVER_ERROR",
            message: err.message || "Internal server error"
        }
    });
}

export default errorMiddleware;