import { Router } from "express";

const router = Router();

router.get("/hello", (req, res) => res.status(200).json({
  message: "Sessions-Assessment-V1 API",
}));

router.get("/health-check", (req, res) => res.status(200).json({
  uptime: process.uptime(),
  responsetime: process.hrtime(),
  message: 'OK',
  timestamp: Date.now(),
}));

router.all("*", (req, res) => res.status(404).json({
  error: "Path not found",
  originalUrl: req.originalUrl,
  path: req.path
}));

router.use((error, req, res, next) => {
  console.log(error);
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
});

export default router;