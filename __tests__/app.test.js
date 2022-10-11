const app = require('../app')
const testData = require("../db/data/test-data/index");
const db = require('../db/connection')
const request = require('supertest')
const seed = require('../db/seeds/seed')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe("GET /api/topics", () => {
    test('respond with an array of topic objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then (({body}) => {
        const { topics } = body
        topics.forEach(topic => {
            expect(topic).toEqual(
                expect.objectContaining({
                    description: expect.any(String),
                    slug: expect.any(String),
                })
            )
        })
        })
    })
    test("throws an error if route is wrong", () => {
        return request(app).get("/api/banana").expect(404)
      })
    })

describe("GET /api/articles/:article_id", () => {
    test("should respond with an object with the properties: author, title, article_id, body,topic,created_at & votes.", () => {
      return request(app)
            .get(`/api/articles/11`)
            .expect(200)
            .then(({ body }) => {
              const { article } = body
              expect(article).toBeInstanceOf(Object)
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: 11,
                  title: "Am I a cat?",
                  topic: "mitch",
                  author: "icellusedkars",
                  body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
                  created_at: expect.any(String),
                  votes: 0,
                })
              )
            })
        })
        test("should respond with a 404 error if an article ID that doesnt exist", () => {
          return request(app)
            .get(`/api/articles/999`)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("No article found for article_id: 999")
            })
        })
        test("should respond with a 400 error if an invalid ID is passed in", () => {
          return request(app)
            .get(`/api/articles/banana`)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid input")
            })
        })
})
describe("GET /api/users", () => {
  test('respond with an array of users objects', () => {
      return request(app)
      .get('/api/users')
      .expect(200)
      .then (({body}) => {
      const { users } = body
      users.forEach(user => {
          expect(user).toEqual(
              expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String)
              })
          )
      })
      })
  })
  test("throws an error if route is wrong", () => {
      return request(app).get("/api/banana").expect(404)
    })
})

describe("PATCH /api/articles/:article_id", () => {
  test('response with an updated inc_vote in the updated article', () => {
    return request(app)
    .patch("/api/articles/11")
    .send({ inc_vote: 1 })
    .expect(201)
    .then(({body}) => {
      expect(body.updatedArticle).toEqual(
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number)
        })
      )
      expect(body.updatedArticle.votes).toBe(1);
      expect(body.updatedArticle.article_id).toBe(11);
    })
  })
  test("should respond with status 400 if vote is not a number ", () => {
    return request(app)
      .patch("/api/articles/11")
      .send({ inc_vote: "banana" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      })
  })
  test("should respond with status 404 if article doesnt exist ", () => {
    return request(app)
      .patch("/api/articles/169")
      .send({ inc_vote: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID")
      })
  })
  test("should respond with status 400 if article ID is not a number ", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_vote: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input")
      })
})
test("should respond with status 400 & bad request when the passed object is empty ", () => {
  return request(app)
    .patch("/api/articles/11")
    .send({})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    })
})
})
describe("GET /api/articles/:article_id", () => {
  test("response should now include a comment_count", () => {
    return request(app)
      .get(`/api/articles/1`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            comment_count: 11
          })
        )
      })
  })
  test("should still return a comment count when there are 0 comments", () => {
    return request(app)
      .get(`/api/articles/2`)
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article).toEqual(
          expect.objectContaining({
            article_id: 2,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
            created_at: expect.any(String),
            votes: 0,
            comment_count: 0,
          })
        )
      })
  })
})
