import fs from "fs";

async function deleteImageFromTemp(fileName) {
  fs.unlink(`/tmp/${fileName}`, (err) => {
    if (err) throw err;
  });
}

export default deleteImageFromTemp;