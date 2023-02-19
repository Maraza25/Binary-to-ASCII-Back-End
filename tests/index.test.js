const request = require('supertest');
const app = require('../app'); // Express.js uygulamanızın dosya yolunu buraya yazın

describe("Test the root path", () => {
  test("It should response the GET method", () => 
    request(app)
      .get("/")
      .expect(200)
      .expect("Content-Type", /html/)
  );
});