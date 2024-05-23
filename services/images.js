import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { throwApiError } from "../../helpers/throw_api_error";
import { sequelize } from "../db/models/index.cjs";

class ImagesService {
  static async downloadFile(url) {
    try {
      const res = await axios({
        method: "get",
        url,
        responseType: "stream"
      });

      const fileName = uuidv4();

      res.data.pipe(fs.createWriteStream(`/temp/${fileName}`));
      return fileName;
    } catch (error) {
      throwApiError("Failed to download image");
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