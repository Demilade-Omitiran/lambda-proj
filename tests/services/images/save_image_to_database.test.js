import { describe, expect, test } from '@jest/globals';
import saveImageToDatabase from '../../../services/images/save_image_to_database';
import getImageFromDatabase from '../../../services/images/get_image_from_database';
import db from '../../../db/models/index.cjs';

describe("Save Image To Database (Images Service)", () => {
  afterAll(async () => {
    await db.sequelize.query("DELETE FROM images");
    await db.sequelize.close();
  });

  test("saves the image to database", async () => {
    const image = await saveImageToDatabase("some-name-1", "url-1");
    const imageInDatabase = await getImageFromDatabase(image.name);

    expect(image).toMatchObject(imageInDatabase);
  });
});