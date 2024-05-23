import axios from "axios";
import * as stream from 'stream';
import { promisify } from 'util';
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { throwApiError } from "../helpers/throw_api_error.js";
import db from "../db/models/index.cjs";

const { sequelize } = db;

const { AWS_S3_BUCKET, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "tiff"];

const ImagesService = {
  async getImageFromDatabase(name) {
    const [[image]] = await sequelize.query(
      `
      SELECT * FROM images
      WHERE name = :name
    `,
      {
        replacements: {
          name,
        },
      },
    );

    return image;
  },

  async downloadFile(url, fileName = null) {
    const parsedUrl = new URL(url);
    const extension = parsedUrl.pathname.split(".").reverse()[0];

    if (!extension || !IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
      throwApiError(400, "Invalid image extension");
    }

    try {
      const finished = promisify(stream.finished);
      fileName = fileName || `${uuidv4()}.${extension}`;
      const writer = fs.createWriteStream(`./temp/${fileName}`);

      const res = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });

      res.data.pipe(writer);
      await finished(writer);
      return fileName;
    } catch (error) {
      console.log(error);
      throwApiError(400, "Failed to download image");
    }
  },

  async saveImageToS3Bucket(fileName) {
    try {
      const readFileAsync = promisify(fs.readFile);
      const client = new S3Client({
        credentials: {
          accessKeyId: AWS_ACCESS_KEY,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
        region: AWS_REGION
      });

      const command = new PutObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: fileName,
        Body: await readFileAsync(`./temp/${fileName}`),
      });

      const response = await client.send(command);
      console.log(response);

      return `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
      console.log(error);
      throwApiError(400, "Failed to upload image to S3");
    }
  },

  async saveImageToDatabase(name, s3Url) {
    const [[image]] = await sequelize.query(
      `
      INSERT INTO images(name, url)
      VALUES(:name, :url)
      ON CONFLICT (name)
      DO UPDATE SET url = :url
      RETURNING *
    `,
      {
        replacements: {
          name,
          url: s3Url
        },
      },
    );

    return image;
  },

  async deleteImageFromTemp(fileName) {
    fs.unlink(`./temp/${fileName}`, (err) => {
      if (err) throw err;
    });
  },

  async saveImage(name, url) {
    let fileName;
    try {
      let image = await this.getImageFromDatabase(name);
      fileName = image?.url.split("/").reverse()[0];
      fileName = await this.downloadFile(url, fileName);
      const s3Url = await this.saveImageToS3Bucket(fileName);
      const data = await this.saveImageToDatabase(name, s3Url);
      return data;
    } finally {
      if (fileName) {
        this.deleteImageFromTemp(fileName);
      }
    }
  }
};

export default ImagesService;