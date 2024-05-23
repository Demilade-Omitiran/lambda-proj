import fs from "fs";
import { promisify } from 'util';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { throwApiError } from "../../helpers/throw_api_error.js";

const { AWS_S3_BUCKET, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

async function saveImageToS3Bucket(fileName) {
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

    return `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;
  } catch (error) {
    console.log(error);
    throwApiError(400, "Failed to upload image to S3");
  }
}

export default saveImageToS3Bucket;