# LAMBDA PROJECT
Tools: ExpressJS (Node), Sequelize (for migrations and database queries), GitHub Actions, AWS Lambda

JSend was used for the response body formats.

**API URL**: https://7daa9pngc9.execute-api.us-east-1.amazonaws.com/default/

## ENDPOINTS
### **GET /health-check**
Health-Check endpoint.

### **GET /images**
This endpoint retrieves all the uploaded images so far.

### **GET /images/:name**
Fetch image by `name`.

### **POST /images**
Params: `name`, `url`
This endpoint downloads an image from the `url`, uploads it to AWS S3, saves the `name` and S3 url, and then returns data on the saved image. If `name` already exists in the database, then the S3 image is overridden. The S3 urls have public-read access.

## RUN IT LOCALLY
- Create a Postgres database.
- Create an AWS S3 bucket.
- Create a .env file containing the variables in the .env.sample file. These variables would be gotten from the creation of the Postgres database and AWS S3 bucket above. The `TEST_` variables aren't required if `npm run test` isn't going to be used.
- Run `npm start`.