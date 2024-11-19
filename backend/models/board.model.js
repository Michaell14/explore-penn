const Joi = require('joi'); // For validation

const BoardModel = {
      schema: Joi.object({
        pin_id: Joi.string().required(),
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        age: Joi.number().min(0),
      }),
      collection: "users",
    };
  
  export default BoardModel;