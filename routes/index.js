import { Router } from "express";
import db from "../db/models/index.cjs";
import ImagesRouter from "./images.js";

const { sequelize } = db;

const router = Router({ mergeParams: true });

router.get("/hello", (req, res) => res.status(200).json({
  message: "Sessions-Assessment-V1 API",
}));

router.get("/health-check", async (req, res, next) => {
  try {
    await sequelize.authenticate();

    return res.status(200).json({
      status: "success",
      message: 'OK',
      data: {
        uptime: process.uptime(),
        responsetime: process.hrtime(),
        timestamp: Date.now(),
      }
    })
  } catch (error) {
    next(error);
  }
});

router.use("/images", ImagesRouter);

router.all("*", (req, res) => res.status(404).json({
  error: "Path not found"
}));

router.use((error, req, res, next) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      message: error.message,
      ...error.extraAttributes
    });
  }

  console.log(error);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
});

export default router;