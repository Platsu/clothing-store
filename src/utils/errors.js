class NotFoundError extends Error {
    constructor(message, code) {
        super(message);

        this.code = code;
        this.status = 404;
    }
}

export {NotFoundError};


class BadRequestError extends Error {
    constructor(message, code) {
        super(message);

        this.code = code;
        this.status = 400;
    }
}

export {BadRequestError};