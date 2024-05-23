# LAMBDA PROJECT
This is an AWS lambda project, built in ExpressJS (Node) and deployed using GitHub Actions.

**API URL**: https://7daa9pngc9.execute-api.us-east-1.amazonaws.com/default/

### ENDPOINTS
1. **GET /health-check**
Health-Check endpoint.

2. **GET /images**
This endpoint retrieves all the uploaded images so far.

3. **GET /images/:name**
Fetch image by `name`.

4. **POST /images**
Params: `name`, `url`
This endpoint downloads an image from the `url`, uploads it to AWS S3, saves the `name` and S3 url, and then returns data on the saved image. If `name` already exists in the database, then the S3 image is overridden. The S3 urls have public-read access.