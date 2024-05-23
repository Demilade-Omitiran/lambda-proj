import express, { json, urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import ServerlessHttp from "serverless-http";
import routes from "./routes/index.js";

const { PORT, ENVIRONMENT } = process.env;

function initApp() {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(json());
  app.use(urlencoded({ extended: false }));

  app.use("(/default)?/", routes);

  return app;
}

function start() {
  const app = initApp();

  if (ENVIRONMENT !== "lambda") {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }

  return ServerlessHttp(app);
}

export const handler = start();