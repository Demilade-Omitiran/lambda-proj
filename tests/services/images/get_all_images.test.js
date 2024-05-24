import { describe, expect, test } from '@jest/globals';
import getAllImages from '../../../services/images/get_all_images';
import db from '../../../db/models/index.cjs';

describe("Get All Images (Images Service)", () => {
  afterAll(async () => {
    await db.sequelize.query("DELETE FROM images");
    await db.sequelize.close();
  });

  test("fetches all images (none created)", async () => {
    const images = await getAllImages();
    expect(images).toBeInstanceOf(Array);
    expect(images).toHaveLength(0);
  });

  test("fetches all images (2 created)", async () => {
    await db.sequelize.query(`
      INSERT INTO images(name, url)
      VALUES ('some-name-1', 'url-1'), ('some-name-2', 'url-2')
    `);

    const images = await getAllImages();

    expect(images).toBeInstanceOf(Array);
    expect(images).toHaveLength(2);
    expect(images[0]).toMatchObject({ name: "some-name-1", url: "url-1" });
    expect(images[0]).toHaveProperty("id");
    expect(images[0]).toHaveProperty("created_at");
    expect(images[0]).toHaveProperty("updated_at");
    expect(images[1]).toMatchObject({ name: "some-name-2", url: "url-2" });
    expect(images[1]).toHaveProperty("id");
    expect(images[1]).toHaveProperty("created_at");
    expect(images[1]).toHaveProperty("updated_at");
  });
});