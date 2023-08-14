const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");
const fs = require("fs/promises");

beforeEach(() => {
  return seed(data);
});

afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200 sends an array of topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toEqual(expect.any(Array));
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("/api", () => {
  test("GET:200 sends object describing all the available endpoints in API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        let count = 0;
        for (const endpoint in body) {
          count++;
          expect(body[endpoint]).toHaveProperty(
            "description",
            expect.any(String)
          );
          expect(body[endpoint]).toHaveProperty("queries", expect.any(Array));
          expect(body[endpoint]).toHaveProperty(
            "exampleResponse",
            expect.any(Object)
          );
        }
        expect(Object.keys(body).length).toBe(count);
      });
  });
});
