import axios from "axios";
import * as stream from 'stream';
import { promisify } from 'util';
import { v4 as uuidv4 } from "uuid";
import { throwApiError } from "../../helpers/throw_api_error";
import { sequelize } from "../db/models/index.cjs";

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
      throwApiError("Failed to download image");
    }
  }

  static async saveImageToS3Bucket(name, fileName) {

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