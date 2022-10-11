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

describe.only("PATCH /api/articles/:article_id", () => {
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
})