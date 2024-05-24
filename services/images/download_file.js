import * as stream from 'stream';
import { promisify } from 'util';
import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { throwApiError } from "../../helpers/throw_api_error.js";

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "tiff"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadFile(url, fileName = null) {
  const parsedUrl = new URL(url);
  const extension = parsedUrl.pathname.split(".").reverse()[0];

  if (!extension || !IMAGE_EXTENSIONS.includes(extension.toLowerCase())) {
    throwApiError(400, "Invalid image extension");
  }

  try {
    const finished = promisify(stream.finished);
    fileName = fileName || `${uuidv4()}.${extension}`;
    const writer = fs.createWriteStream(`/tmp/${fileName}`);

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
}

export default downloadFile;