import { describe, expect, test } from '@jest/globals';
import supertest from 'supertest';
import db from '../../db/models/index.cjs';
import { handler } from "../../index.js";

const request = supertest(handler);

describe("Images GET Endpoints", () => {
  afterAll(async () => {
    await db.sequelize.query("DELETE FROM images");
    await db.sequelize.close();
    handler.close();
  });

  test("fetches all images (none created)", async () => {
    const response = await request.get("/images");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Images retrieved successfully");
    expect(response.body.status).toBe("success");
    expect(response.body.data).toMatchObject([]);
  });

  test("fetches all images (2 created)", async () => {
    await db.sequelize.query(`
      INSERT INTO images(name, url)
      VALUES ('some-name-1', 'url-1'), ('some-name-2', 'url-2')
    `);

    const response = await request.get("/images");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Images retrieved successfully");
    expect(response.body.status).toBe("success");

    const images = response.body.data;

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

  test("fetches non-existent image", async () => {
    const response = await request.get("/images/some-name-3");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Image not found");
    expect(response.body.status).toBe("fail");
  });

  test("fetches image", async () => {
    const response = await request.get("/images/some-name-1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Image retrieved successfully");
    expect(response.body.status).toBe("success");
    expect(response.body.data).toMatchObject({ name: "some-name-1", url: "url-1" });
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data).toHaveProperty("created_at");
    expect(response.body.data).toHaveProperty("updated_at");
  });
});