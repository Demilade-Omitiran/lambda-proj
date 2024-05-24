import { describe, expect, test } from '@jest/globals';
import getImageFromDatabase from '../../../services/images/get_image_from_database';
import db from '../../../db/models/index.cjs';

describe("Get Image From Database (Images Service)", () => {
  afterAll(async () => {
    await db.sequelize.query("DELETE FROM images");
    await db.sequelize.close();
  });

  test("fetches non-existent image", async () => {
    const image = await getImageFromDatabase("some-name-1");
    expect(image).toBe(undefined);
  });

  test("fetches image", async () => {
    await db.sequelize.query(`
      INSERT INTO images(name, url)
      VALUES ('some-name-1', 'url-1'), ('some-name-2', 'url-2')
    `);

    const image = await getImageFromDatabase("some-name-1");

    expect(image).toMatchObject({ name: "some-name-1", url: "url-1" });
    expect(image).toHaveProperty("id");
    expect(image).toHaveProperty("created_at");
    expect(image).toHaveProperty("updated_at");
  });
});