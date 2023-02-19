const request = require('supertest');
const { app, asciiToBinary } = require('../app'); 

describe('asciiToBinary', () => {
  test('basit bir ascii dizesini binarye çevirmesi gerekiyor', () => {
    expect(asciiToBinary('hello')).toBe('01101000 01100101 01101100 01101100 01101111');
  });

  test('özel karakterler içeren bir ascii dizesini binarye çevirmesi gerekiyor', () => {
    expect(asciiToBinary('1+1=2')).toBe('00110001 00101011 00110001 00111101 00110010');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => asciiToBinary(123)).toThrow('Girdi bir dize olmalı');
  });

  test('girdi non-ascii karakterler içeriyorsa bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => asciiToBinary('こんにちは')).toThrow('Girdi sadece ASCII karakterlerini içermeli');
  });
});


describe("Test the root path", () => {
  test("It should response the GET method", () => 
    request(app)
      .get("/")
      .expect(200)
      .expect("Content-Type", /html/)
  );
});