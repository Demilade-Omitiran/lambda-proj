# LAMBDA PROJECT
This is an AWS lambda project, built in ExpressJS (Node) and deployed using GitHub Actions.

### ENDPOINTS
- **GET /health-check**
Health-Check endpoint.

- **GET /images**
This endpoint retrieves all the uploaded images so far.

- **GET /images/:name**
Fetch image by `name`.

- **POST /images**
Params: `name`, `url`
This endpoint downloads an image from the `url`, uploads it to AWS S3, saves the `name` and S3 url, and then returns data on the saved image. If `name` already exists in the database, then the S3 image is overridden.