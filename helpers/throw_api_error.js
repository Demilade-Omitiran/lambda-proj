export const throwApiError = (statusCode, message, extraAttributes = {}) => {
  const apiError = Object.create(Error);
  apiError.message = message;
  apiError.statusCode = statusCode;
  apiError.extraAttributes = extraAttributes;
  apiError.isOperational = true;

  throw apiError;
};
