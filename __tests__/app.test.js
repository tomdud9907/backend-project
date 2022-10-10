const app = require('../app')
const testData = require("../db/data/test-data/index");
const db = require('../db/connection')
const request = require('supertest')
const seed = require('../db/seeds/seed')
beforeEach(() => seed(testData));
afterAll(() => db.end());

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
})