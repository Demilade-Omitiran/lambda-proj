import Joi from "joi";
import { throwApiError } from "../helpers/throw_api_error.js";
import ImagesService from "../services/images.js";

const saveImageSchema = Joi.object({
  url: Joi.string().uri().required(),
  name: Joi.string().trim().required(),
});

function validateSchema(schema, obj) {
  const { error, value } = schema.validate(obj);

  if (error) {
    const { details } = error;
    const { message } = details[0];
    throwApiError(400, message, { status: "fail" });
  }
}

const ImagesController = {
  async saveImage(req, res, next) {
    try {
      validateSchema(saveImageSchema, req.body);

      const { name, url } = req.body;

      const imageData = await ImagesService.saveImage(name, url);

      return res.status(200).json({
        message: "Image saved successfully",
        data: imageData,
        status: "success"
      });
    } catch (error) {
      next(error);
    }
  }
};

export default ImagesController;