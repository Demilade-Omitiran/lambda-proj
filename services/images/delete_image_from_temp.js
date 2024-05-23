import fs from "fs";
import { fileURLToPath } from 'url';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deleteImageFromTemp(fileName) {
  fs.unlink(path.join(__dirname, `../../tmp/${fileName}`), (err) => {
    if (err) throw err;
  });
}

export default deleteImageFromTemp;