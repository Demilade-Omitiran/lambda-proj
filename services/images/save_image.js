import getImageFromDatabase from "./get_image_from_database.js";
import downloadFile from "./download_file.js";
import saveImageToS3Bucket from "./save_image_to_s3_bucket.js";
import saveImageToDatabase from "./save_image_to_database.js";
import deleteImageFromTemp from "./delete_image_from_temp.js";

async function saveImage(name, url) {
  let fileName;
  try {
    let image = await getImageFromDatabase(name);
    fileName = image?.url.split("/").reverse()[0];
    fileName = await downloadFile(url, fileName);
    const s3Url = await saveImageToS3Bucket(fileName);
    const data = await saveImageToDatabase(name, s3Url);
    return data;
  } finally {
    if (fileName) {
      await deleteImageFromTemp(fileName);
    }
  }
}

export default saveImage;