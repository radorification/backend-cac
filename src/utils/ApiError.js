class ApiError extends Error{
    constructor(
        statusCode,
        errors=[],
        message = "Somethingwent wrong",
        stack = ""
    ){
        super(message);
        this.errors = errors;
        this.success = "false";
        this.data = null;
        this.statusCode = statusCode;
        this.message = message;

        if(stack){
            this.stack = stack;
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}