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


describe("/api/articles", () => {
  test("GET:200 sends an array of articles in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          if (article.article_id === 1) {
            expect(article.comment_count).toBe(11);
          }
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(Number));
          expect(article).not.toHaveProperty("body");
        });
      });
  });

  
});


describe("/api/articles/:article_id/comments", () => {
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
        const { comments } = body
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
        const { msg } = body
        expect(msg).toBe('article does not exist');
      });

  });
  

  describe('/api/articles/:article_id/comments', () => {
    test("POST:201 inserts a new comment to the database and sends the new comment back to the user", () => {
      const newComment = {
        username: "rogersop",
        body: "test body comment",
      };
      return request(app)
        .post('/api/articles/1/comments').send(newComment).expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toHaveProperty("comment_id", 19);
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("created_at", (expect.any(String)));
          expect(comment).toHaveProperty("author", "rogersop");
          expect(comment).toHaveProperty("body", "test body comment");
          expect(comment).toHaveProperty("article_id", 1);
        });
    })
    test("POST:201 inserts a new comment when the comment has extra properties", () => {
      const newComment = {
        username: "rogersop",
        body: "test body comment",
        avatar_id: 55,
        picUrl : 'www.picture.com'
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toHaveProperty("comment_id", 19);
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", "rogersop");
          expect(comment).toHaveProperty("body", "test body comment");
          expect(comment).toHaveProperty("article_id", 1);
          expect(comment).not.toHaveProperty("avatar_id")
          expect(comment).not.toHaveProperty("picUrl");

        });
    });

    test("POST 404: responds with error message when provided invalid username ", () => {
      const newComment = {
        username: "Peter",
        body: "Test test test"
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Not found");
        });
    });

    test("POST 400: responds with error message when provided newComment without a body", () => {
      const newComment = {
        username: "rogersop"
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad request");
        });
    });

      test("POST 400: responds with error message when provided newComment without a username", () => {
        const newComment = {
          body: "rogersop",
        };
        return request(app)
          .post("/api/articles/1/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Bad request");
          });
      });


    test("POST 400: responds with error message when  passed an invalid article id ", () => {
      const newComment = {
        username: "rogersop",
        body: "sfdfsdfs",
      };
      return request(app)
        .post("/api/articles/banana/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toBe("Bad request");
        });
    });
  
      test("POST 404: responds with error message when provided newComment with a article that does not exist ", () => {
     const newComment = {
       username: "rogersop",
       body: "test body comment",
     };    return request(app)
          .post("/api/articles/999/comments")
          .send(newComment)
          .expect(404)
       .then(({ body }) => {
            const { msg } = body;
            expect(msg).toBe("Not found");
          });
      });
  });

  
  



})