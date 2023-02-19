// asciiToBinary.test.js
const { asciiToBinary } = require('../app');

describe('asciiToBinary', () => {
  it('ASCII karakterleri ikilik sayıya doğru bir şekilde dönüştürmelidir', () => {
    // ASCII karakterlerini ikilik sayılara dönüştürmek için örnek girdiler ve çıktılar tanımlayalım
    const examples = [
      ['A', '01000001'],
      ['B', '01000010'],
      ['C', '01000011'],
      ['Z', '01011010'],
      ['a', '01100001'],
      ['b', '01100010'],
      ['c', '01100011'],
      ['z', '01111010'],
      ['1', '00110001'],
      ['2', '00110010'],
      ['9', '00111001'],
      [' ', '00100000'],
      ['!', '00100001'],
      ['$', '00100100'],
      ['&', '00100110'],
      ['@', '01000000'],
      ['%', '00100101'],
      ['^', '01011110'],
      ['*', '00101010'],
    ];

    // Her örnek girdi için fonksiyonun doğru çıktı verip vermediğini kontrol edelim
    examples.forEach(([input, expectedOutput]) => {
      const result = asciiToBinary(input);
      console.log(`${input}: ${result}`); // cevabı konsola yazdır
      expect(result).toEqual(expectedOutput);
    });
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