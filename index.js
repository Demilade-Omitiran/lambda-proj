import express, { json, urlencoded } from "express";
import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import fs from "fs";
import { promisify } from 'util';
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

function createTmpFolder() {
  const dir = './tmp';

  const fsAccess = promisify(fs.access);
  const fsMkdir = promisify(fs.mkdir);

  fsAccess(dir, fs.constants.F_OK)
    .catch((err1) => {
      fsMkdir(dir);
    }).catch((err2) => {
      throw err2;
    });
}

function start() {
  const app = initApp();
  createTmpFolder();

  if (ENVIRONMENT !== "lambda") {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  }

  return ServerlessHttp(app);
}

export const handler = start();