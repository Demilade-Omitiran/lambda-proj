import express, { json, urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import ServerlessHttp from "serverless-http";
import routes from "./routes.js";

// const { PORT } = process.env;

function initApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(json());
  app.use(urlencoded({ extended: false }));

  app.use("/api/v1/", routes);

  return app;
}

function start() {
  const app = initApp();

  // app.listen(PORT, () => {
  //   console.log(`Server listening on port ${PORT}`);
  // });

  return ServerlessHttp(app);
}

export default start();