const request = require('supertest');
const app = require('../app'); // Express.js uygulamanızın dosya yolunu buraya yazın

describe("Test the root path", () => {
  test("It should response the GET method", () => {
    return request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
});


afterEach(() => {
  app.close();
})