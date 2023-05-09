function Response() {
    this.status = 200;
    this.success = true;
    this.message = "";
    this.data = {};
}
function successResponse(message, data) {
    let res = {};
    res.status = 200;
    res.success = true;
    res.message = message;
    res.data = data;
    return res;
} 

function notFound(message, data) {
    let res = new Response();
    res.status = 404;
    res.success = true;
    res.message = message;
    res.data = data;
    res.err = data;
    return res;
}
function validationError(message, data, err) {
    let res = new Response();
    res.status = 422;
    res.success = false;
    res.message = message;
    res.data = data;
    res.err = err;
    return res;
}

function unAuthorized(message,data,err){
    let res = new Response();
    res.status = 401;
    res.success = false;
    res.message = message;
    res.data = data;
    res.err = err;
    return res;

}

function failResponse(message, data, err) {
    let res = new Response();
    res.status = 500;
    res.success = false;
    res.message = message;
    res.data = data;
    res.err = err;
    return res;
}


module.exports = {
    successResponse,
    failResponse,
    notFound,
    validationError,
    unAuthorized
}
