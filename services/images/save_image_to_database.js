import db from "../../db/models/index.cjs";

const { sequelize } = db;

async function saveImageToDatabase(name, s3Url) {
  const [[image]] = await sequelize.query(
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

  return image;
}

export default saveImageToDatabase;