const request = require('supertest');
const { app, asciiToBinary, binaryToAscii, asciiToOctal, binaryToOctal, octalToAscii, octalToBinary } = require('../app'); 

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

describe('asciiToOctal', () => {
  test('basit bir ascii dizesini octale çevirmesi gerekiyor', () => {
    expect(asciiToOctal('hello')).toBe('150 145 154 154 157');
  });

  test('özel karakterler içeren bir ascii dizesini octale çevirmesi gerekiyor', () => {
    expect(asciiToOctal('1+1=2')).toBe('061 053 061 075 062');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => asciiToOctal(123)).toThrow('Girdi bir dize olmalı');
  });

  test('girdi non-ascii karakterler içeriyorsa bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => asciiToOctal('こんにちは')).toThrow('Girdi sadece ASCII karakterlerini içermeli');
  });
});

describe('binaryToAscii', () => {
  test('basit bir binary dizisini asciie çevirmesi gerekiyor', () => {
    expect(binaryToAscii('01101000 01100101 01101100 01101100 01101111')).toBe('hello');
  });

  test('özel karakterler içeren bir binary dizisini asciie çevirmesi gerekiyor', () => {
    expect(binaryToAscii('00110001 00101011 00110001 00111101 00110010')).toBe('1+1=2');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => binaryToAscii(123)).toThrow('Girdi bir dize olmalı');
  });

  test('geçersiz bir binary dizesi verildiğinde bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => binaryToAscii('01101000 01100101 01101111 2')).toThrow('Geçersiz binary dizesi');
  });
});

describe('binaryToOctal', () => {
  test('basit bir binary dizisini octale çevirmesi gerekiyor', () => {
    expect(binaryToOctal('110110')).toBe('66');
  });

  test('özel karakterler içeren bir binary dizisini octale çevirmesi gerekiyor', () => {
    expect(binaryToOctal('01101000 01100101 01101100 01101100 01101111')).toBe('150 145 154 154 157');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => binaryToOctal(123)).toThrow('Girdi bir dize olmalı');
  });

  test('geçersiz bir binary dizesi verildiğinde bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => binaryToOctal('01101000 01100101 01101111 2')).toThrow('Geçersiz binary dizesi');
  });
});

describe('octalToAscii', () => {
  test('basit bir octal dizisini asciiye çevirmesi gerekiyor', () => {
    expect(octalToAscii('150 145 154 154 157')).toBe('hello');
  });

  test('özel karakterler içeren bir octal dizisini asciiye çevirmesi gerekiyor', () => {
    expect(octalToAscii('061 053 061 075 062')).toBe('1+1=2');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => octalToAscii(123)).toThrow('Girdi bir dize olmalı');
  });

  test('girdi non-octal karakterler içeriyorsa bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => octalToAscii('150 145 154 154 157 8')).toThrow('Geçersiz octal dizesi');
  });
});

describe('octalToBinary', () => {
  test('basit bir octal dizisini binarye çevirmesi gerekiyor', () => {
    expect(octalToBinary('150 145 154 154 157')).toBe('001101000 001100101 001101100 001101100 001101111');
  });

  test('özel karakterler içeren bir octal dizisini binarye çevirmesi gerekiyor', () => {
    expect(octalToBinary('061 053 061 075 062')).toBe('000110001 000101011 000110001 000111101 000110010');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => octalToBinary(123)).toThrow('Girdi bir dize olmalı');
  });

  test('girdi non-octal karakterler içeriyorsa bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => octalToBinary('150 145 154 154 157 8')).toThrow('Geçersiz octal dizesi');
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