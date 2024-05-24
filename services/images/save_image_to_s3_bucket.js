import "dotenv/config";
import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
import { promisify } from 'util';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { throwApiError } from "../../helpers/throw_api_error.js";

const { AWS_S3_BUCKET, AWSACCESSKEYID, AWSSECRETACCESSKEY, AWS_REGION } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function saveImageToS3Bucket(fileName) {
  try {
    const readFileAsync = promisify(fs.readFile);
    const client = new S3Client({
      credentials: {
        accessKeyId: AWSACCESSKEYID,
        secretAccessKey: AWSSECRETACCESSKEY,
      },
      region: AWS_REGION
    });

    const command = new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: fileName,
      Body: await readFileAsync(`/tmp/${fileName}`),
    });

    const response = await client.send(command);

    return `https://${AWS_S3_BUCKET}.s3.amazonaws.com/${fileName}`;
  } catch (error) {
    console.log(error);
    throwApiError(400, "Failed to upload image to S3");
  }
}

export default saveImageToS3Bucket;