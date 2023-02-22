const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const querystring = require('querystring');
const chaiHttp = require('chai-http');
const mock = require('mock-fs');


chai.use(chaiHttp);


// test kodu buraya gelecek


sinon.useFakeTimers();


const index_html=`<!DOCTYPE html>
 <html lang="en">
 
 <head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet" href="/assets/style.css">
 
   <title>Document</title>
 </head>
 
 <body>
   <form onsubmit="submitForm(event)">
 
     <select name="sourceType" id="sourceType">
       <option value="ascii">ASCII</option>
       <option value="binary">Binary</option>
       <option value="octal">Octal</option>
     </select> To
     <select name="destType" id="destType">
       <option value="binary">Binary</option>
       <option value="ascii">ASCII</option>
       <option value="octal">Octal</option>
     </select> <br>
     <input type="text" name="value" id="value" />
 
 
 
     <button type="submit">Submit</button>
     <button onclick="kopyala()">Copy</button>
     <textarea id="textbox" disabled></textarea>
 
 
   </form>
 
 
   <div class="container mt-5 " style="display: flex; justify-content: center;">
     <button class="button" onclick="paylasButonu()" id="paylas_button">Share</button>
   </div>
 
 
 
 
 
 
 
 
   <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
   <script src="/assets/script.js"></script>
 
 </body>
 
  </html>`



const { app, asciiToBinary, binaryToAscii, asciiToOctal, binaryToOctal, octalToAscii, octalToBinary,convertMessage } = require('../app'); 

describe('asciiToBinary', () => {
  test('basit bir ascii dizesini binarye çevirmesi gerekiyor', () => {
    expect(asciiToBinary('hello')).to.equal('01101000 01100101 01101100 01101100 01101111');
  });

  test('özel karakterler içeren bir ascii dizesini binarye çevirmesi gerekiyor', () => {
    expect(asciiToBinary('1+1=2')).to.equal('00110001 00101011 00110001 00111101 00110010');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => asciiToBinary(123)).to.throw('Girdi bir dize olmalı');
  });

  test('girdi non-ascii karakterler içeriyorsa bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => asciiToBinary('こんにちは')).to.throw('Girdi sadece ASCII karakterlerini içermeli');
  });
});

describe('asciiToOctal', () => {
  test('basit bir ascii dizesini octale çevirmesi gerekiyor', () => {
    expect(asciiToOctal('hello')).to.equal('150 145 154 154 157');
  });

  test('özel karakterler içeren bir ascii dizesini octale çevirmesi gerekiyor', () => {
    expect(asciiToOctal('1+1=2')).to.equal('061 053 061 075 062');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => asciiToOctal(123)).to.throw('Girdi bir dize olmalı');
  });

  test('girdi non-ascii karakterler içeriyorsa bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => asciiToOctal('こんにちは')).to.throw('Girdi sadece ASCII karakterlerini içermeli');
  });
});

describe('binaryToAscii', () => {
  test('basit bir binary dizisini asciie çevirmesi gerekiyor', () => {
    expect(binaryToAscii('01101000 01100101 01101100 01101100 01101111')).to.equal('hello');
  });

  test('özel karakterler içeren bir binary dizisini asciie çevirmesi gerekiyor', () => {
    expect(binaryToAscii('00110001 00101011 00110001 00111101 00110010')).to.equal('1+1=2');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => binaryToAscii(123)).to.throw('Girdi bir dize olmalı');
  });

  test('geçersiz bir binary dizesi verildiğinde bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => binaryToAscii('01101000 01100101 01101111 2')).to.throw('Geçersiz binary dizesi');
  });
});

describe('binaryToOctal', () => {
  test('basit bir binary dizisini octale çevirmesi gerekiyor', () => {
    expect(binaryToOctal('110110')).to.equal('66');
  });

  test('özel karakterler içeren bir binary dizisini octale çevirmesi gerekiyor', () => {
    expect(binaryToOctal('01101000 01100101 01101100 01101100 01101111')).to.equal('150 145 154 154 157');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => binaryToOctal(123)).to.throw('Girdi bir dize olmalı');
  });

  test('geçersiz bir binary dizesi verildiğinde bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => binaryToOctal('01101000 01100101 01101111 2')).to.throw('Geçersiz binary dizesi');
  });
});

describe('octalToAscii', () => {
  test('basit bir octal dizisini asciiye çevirmesi gerekiyor', () => {
    expect(octalToAscii('150 145 154 154 157')).to.equal('hello');
  });

  test('özel karakterler içeren bir octal dizisini asciiye çevirmesi gerekiyor', () => {
    expect(octalToAscii('061 053 061 075 062')).to.equal('1+1=2');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => octalToAscii(123)).to.throw('Girdi bir dize olmalı');
  });

  test('girdi non-octal karakterler içeriyorsa bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => octalToAscii('150 145 154 154 157 8')).to.throw('Geçersiz octal dizesi');
  });
});

describe('octalToBinary', () => {
  test('basit bir octal dizisini binarye çevirmesi gerekiyor', () => {
    expect(octalToBinary('150 145 154 154 157')).to.equal('001101000 001100101 001101100 001101100 001101111');
  });

  test('özel karakterler içeren bir octal dizisini binarye çevirmesi gerekiyor', () => {
    expect(octalToBinary('061 053 061 075 062')).to.equal('000110001 000101011 000110001 000111101 000110010');
  });

  test('girdi bir dize değilse bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => octalToBinary(123)).to.throw('Girdi bir dize olmalı');
  });

  test('girdi non-octal karakterler içeriyorsa bir hata mesajı döndürmesi gerekiyor', () => {
    expect(() => octalToBinary('150 145 154 154 157 8')).to.throw('Geçersiz octal dizesi');
  });
});

describe("convertMessage function", () => {
  it("should convert binary to octal", () => {
    const sourceType = "binary";
    const destType = "octal";
    const value = "101110";

    const expected = "56";
    const result = convertMessage(sourceType, destType, value);

    expect(result).to.equal(expected);
  });

  it("should convert ascii to octal", () => {
    const sourceType = "ascii";
    const destType = "octal";
    const value = "hello";

    const expected = "150 145 154 154 157";
    const result = convertMessage(sourceType, destType, value);

    expect(result).to.equal(expected);
  });

  it("should convert octal to binary", () => {
    const sourceType = "octal";
    const destType = "binary";
    const value = "56";

    const expected = "101110";
    const result = convertMessage(sourceType, destType, value);

    expect(result).to.equal(expected);
  });

  it("should convert octal to ascii", () => {
    const sourceType = "octal";
    const destType = "ascii";
    const value = "150 145 154 154 157";

    const expected = "hello";
    const result = convertMessage(sourceType, destType, value);

    expect(result).to.equal(expected);
  });

  it("should convert ascii to binary", () => {
    const sourceType = "ascii";
    const destType = "binary";
    const value = "hello";

    const expected = "01101000 01100101 01101100 01101100 01101111";
    const result = convertMessage(sourceType, destType, value);

    expect(result).to.equal(expected);
  });

  it("should convert binary to ascii", () => {
    const sourceType = "binary";
    const destType = "ascii";
    const value = "01101000 01100101 01101100 01101100 01101111";

    const expected = "hello";
    const result = convertMessage(sourceType, destType, value);

    expect(result).to.equal(expected);
  });
});

  



describe('GET /', () => {
  beforeEach(() => {
    mock({
      '/path/to/wrong/file.html': 'file content',
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('hatalı dosya yolu girildiğinde Internal Server Error döndürmeli', (done) => {
    const wrongFilePath = '/path/to/wrong/file.html';
    const readFileStub = sinon.stub(fs, 'readFile').callsFake((path, options, callback) => {
      callback(new Error('Dosya bulunamadı'), null);
    });

    request(app)
      .get('/')
      .expect(500)
      .end((err, res) => {
        expect(readFileStub.calledOnce).to.be.true;
        readFileStub.restore();
        done(err);
      });
  });


});

describe('GET /shared', () => {
  beforeEach(() => {
    mock({
      '/path/to/wrong/file.html': 'file content',
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('hatalı dosya yolu girildiğinde Internal Server Error döndürmeli', (done) => {
    const wrongFilePath = '/path/to/wrong/file.html';
    const readFileStub = sinon.stub(fs, 'readFile').callsFake((path, options, callback) => {
      callback(new Error('Dosya bulunamadı'), null);
    });

    request(app)
      .get('/shared')
      .expect(500)
      .end((err, res) => {
        expect(readFileStub.calledOnce).to.be.true;
        readFileStub.restore();
        done(err);
      });
  });


});

describe('POST /convert', () => {
  it('should return 200 OK and response body should match expected values', async () => {
    const requestBody = {
      sourceType: 'ascii',
      destType: 'binary',
      value: 'hello'
    };
    const expectedResponseBody = '01101000 01100101 01101100 01101100 01101111'

    const response = await request(app)
      .post('/convert')
      .send(requestBody);

    expect(response.statusCode).to.equal(200);
    expect(response.body.message).to.eql(expectedResponseBody);
  });

  it('should log the expected values to the console', async () => {
    const consoleLog = jest.spyOn(console, 'log').mockImplementation();

    const requestBody = {
      sourceType: 'ascii',
      destType: 'binary',
      value: 'hello'
    };
    const expectedConsoleLog = 'hello';//gelen veri

    await request(app)
      .post('/convert')
      .send(requestBody);

    expect(consoleLog.mock.calls[0][0]).to.equal(expectedConsoleLog);
    consoleLog.mockRestore();
  });
});

describe("GET /shared", () => {
  it("should return 200 OK and modified HTML page", async () => {
    const sourceType = "ascii";
    const destType = "binary";
    const value = "hello";
    const expectedButtonText = "Try Yourself";
    
    const response = await request(app)
      .get(`/shared?sourceType=${sourceType}&destType=${destType}&value=${value}`)
    
    expect(response.statusCode).to.equal(200);
    expect(response.text).to.contain(convertMessage(sourceType, destType, value));
    expect(response.text).to.contain(`value="${value}" disabled`);
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

describe("POST /convert", () => {
  it("should return 200 OK and response body should match expected values", async () => {
    const requestBody = { sourceType: "ascii", destType: "binary", value: "hello" };
    const expectedResponseBody = {
      message: "01101000 01100101 01101100 01101100 01101111",
      url: "http://localhost:3000/shared?sourceType=ascii&destType=binary&value=hello",
      body: requestBody,
    };

    const response = await request(app)
      .post("/convert")
      .send(requestBody);

    expect(response.body).to.deep.equal(expectedResponseBody);
  });

  // it("should log the expected values to the console", async () => {
  //   const consoleLog = jest.spyOn(console, "log");

  //   const requestBody = { sourceType: "ascii", destType: "binary", value: "hello" };
  //   const expectedConsoleLog = [
  //     requestBody.value.toString(),
  //     requestBody.sourceType,
  //     requestBody.destType,
  //     "http://localhost:3000/shared?sourceType=ascii&destType=binary&value=hello",
      
  //   ];

  //   await request(app)
  //     .post("/convert")
  //     .send(requestBody);

  //   expect(consoleLog.mock.calls[0]).to.equal(expectedConsoleLog);
  //   consoleLog.mockRestore();
  // });
});







