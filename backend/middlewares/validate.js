const { validationError } = require("../helper/response");

const node_env = process.env.RUN_MODE;

const joiValidate = (schema) => {
  return (request, response, next) => {
    let { error } = schema.validate(request.body ? request.body : {});
    //console.log("error", error);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      const key = details.map((i) => i.context.key).join(",");
      if (node_env === "LOCAL") {
        response.send(validationError(message))
      } else {
        //response.send(validationError(message, key));
        response.status(422).json(
          validationError(0, {
              validationKey: key,
              validationMessage: message,
          })
      );
      }
    }
  };
};

module.exports = {
  joiValidate,
};
