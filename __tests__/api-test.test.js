const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index.js");
const app = require("../app.js");
const fs = require("fs/promises");
const endpointObj = require("/Users/peterakin-nibosun/northcoders/backend/be-nc-news/endpoints.json")

beforeEach(() => seed(data));

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
        expect(body).toEqual(endpointObj);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET:200 sends an article object which corresponds to the specific article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("title", "Living in the shadow of a great man");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("created_at", '2020-07-09T20:11:00.000Z');
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
  });

  test('GET:404 sends an appropriate error message when given a valid but non-existent id', () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("article does not exist");
      });
  });
    
  test('GET:400 sends an appropriate error message when given an invalid id', () => {
    return request(app)
      .get("/api/articles/scooby")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Bad request");
      });
    
  })
  test("GET:404 when given an incorrect path", () => {
    return request(app)
      .get("/api/notapath")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Not found");
      });
  });
});


describe("GET /api/articles", () => {
  test("GET:200 sends an array of articles in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body).toBeSortedBy("created_at", { descending: true, });
        body.forEach((article) => {
          if (article.article_id === 1) {
              expect(article.comment_count).toBe(11)
            }
          expect(article).toHaveProperty("title",expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body")
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 an array of comments for the given article_id, with the most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(11)
        expect(comments).toBeSortedBy("created_at", { descending: true });
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", 1);
        });
      });
  });

  test("GET:200 responds with an empty array if id exist but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const {comments} = body
        expect(comments).toEqual([])
      });
  });


  test('GET:400 sends an appropriate error message when given an invalid id', () => {
    return request(app)
      .get("/api/articles/scooby/comments")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body
        expect(msg).toBe("Bad request");
      });
  })

  test('GET:404 sends an appropriate message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        const {msg} = body
        expect(msg).toBe('article does not exist');
      });

  });  
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH 200: increments the votes property on article id by the vote amount provided on the request", () => {
    const newVotes = {
      inc_votes: 20
    };
    return request(app)
      .patch('/api/articles/1')
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("title", "Living in the shadow of a great man");
        expect(article).toHaveProperty("body","I find this existence challenging");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("created_at", '2020-07-09T20:11:00.000Z');
        expect(article).toHaveProperty("votes", 120);
        expect(article).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
  });

  test("PATCH 200: decrements the votes property on article id by the vote amount provided on the request", () => {
    const newVotes = {
      inc_votes: -30
    };
    return request(app)
      .patch('/api/articles/1')
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("votes", 70);
      });
  });


  test("PATCH 400 : user sends us a value on the key inc_votes thats not a number", () => {
    const newVotes = {
      inc_votes: "blue",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Bad request");
      });
  });

  test ("PATCH 404: responds with error message when provided using an article that does not exist", () => {
    const newVotes = {
      inc_votes: -30,
    };
    return request(app)
      .patch("/api/articles/999")
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("article not found");
      });
  });

   test("PATCH 400: responds with error message when provided with an invalid id", () => {
     const newVotes = {
       inc_votes: -30,
     };
     return request(app)
       .patch("/api/articles/banana")
       .send(newVotes)
       .expect(400)
       .then(({ body }) => {
         const { msg } = body;
         expect(msg).toBe("Bad request");
       });
   });

  test("PATCH 200: responds with the article unchanged when no message is provided", () => {
    const newVotes = {
    };
    return request(app)
      .patch('/api/articles/1')
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        
        const { article } = body;
        expect(article).toHaveProperty("title", "Living in the shadow of a great man");
        expect(article).toHaveProperty("body", "I find this existence challenging");
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("created_at", '2020-07-09T20:11:00.000Z');
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
  });



  });


