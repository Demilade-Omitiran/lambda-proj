import axios from "axios";
import * as stream from 'stream';
import { promisify } from 'util';
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { throwApiError } from "../helpers/throw_api_error.js";
import { sequelize } from "../db/models/index.cjs";

const { AWS_S3_BUCKET, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

class ImagesService {
  static async downloadFile(url) {
    try {
      const finished = promisify(stream.finished);
      const writer = createWriteStream(`/temp/${fileName}`);

      const res = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });

      response.data.pipe(writer);
      const fileName = uuidv4();
      await finished(writer);
      return fileName;
    } catch (error) {
      throwApiError(400, "Failed to download image");
    }
  }

  static async saveImageToS3Bucket(fileName) {
    try {
      const readFileAsync = promisify(fs.readFile);
      const client = new S3Client({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
      });

      const command = new PutObjectCommand({
        Bucket: AWS_S3_BUCKET,
        Key: fileName,
        Body: await readFileAsync(`/temp/${fileName}`),
      });

      const response = await client.send(command);
      console.log(response);

      return response;
    } catch (error) {
      console.log(error);
      throwApiError(400, "Failed to upload image to S3");
    }
  }

  static async saveImageToDatabase(name, s3Url) {
    const image = await sequelize.query(
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
  }
}

export default ImagesService;