class AppError extends Error {
    constructor(
        code = 'UNKNOWN_ERROR',
        status = 500,
        message = 'An unexpected error occurred.'
    ) {
        super(message)
        this.code = code
        this.status = status
        this.type = status >= 400 && status < 500 ? "ClientError" : "ServerError"
        Error.captureStackTrace(this, this.constructor) // Capture stack trace for debugging
    }
}

export default new AppError()