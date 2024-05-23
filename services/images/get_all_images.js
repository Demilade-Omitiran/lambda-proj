import db from "../../db/models/index.cjs";

const { sequelize } = db;

async function getAllImages() {
  const [images] = await sequelize.query(`SELECT * FROM images`);

  return images;
}

export default getAllImages;