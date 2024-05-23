import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { throwApiError } from "../../helpers/throw_api_error";

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
}

export default ImagesService;