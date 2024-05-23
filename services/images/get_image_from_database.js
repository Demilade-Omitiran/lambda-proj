import db from "../../db/models/index.cjs";

const { sequelize } = db;

async function getImageFromDatabase(name) {
  const [[image]] = await sequelize.query(
    `
    SELECT * FROM images
    WHERE name = :name
  `,
    {
      replacements: {
        name,
      },
    },
  );

  return image;
}

export default getImageFromDatabase;