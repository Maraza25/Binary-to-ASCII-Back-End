const request = require("supertest");
const sinon = require("sinon");
const fs = require("fs");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const querystring = require("querystring");
const chaiHttp = require("chai-http");
const mock = require("mock-fs");

chai.use(chaiHttp);

// test kodu buraya gelecek

sinon.useFakeTimers();

const index_html = `<!DOCTYPE html>
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
 
  </html>`;

const { app } = require("../app");

describe("GET /", () => {
  beforeEach(() => {
    mock({
      "/path/to/wrong/file.html": "file content",
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("hatalı dosya yolu girildiğinde Internal Server Error döndürmeli", (done) => {
    const wrongFilePath = "/path/to/wrong/file.html";
    const readFileStub = sinon
      .stub(fs, "readFile")
      .callsFake((path, options, callback) => {
        callback(new Error("Dosya bulunamadı"), null);
      });

    request(app)
      .get("/")
      .expect(500)
      .end((err, res) => {
        expect(readFileStub.calledOnce).to.be.true;
        readFileStub.restore();
        done(err);
      });
  });
});

describe("GET /shared", () => {
  beforeEach(() => {
    mock({
      "/path/to/wrong/file.html": "file content",
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("hatalı dosya yolu girildiğinde Internal Server Error döndürmeli", (done) => {
    const wrongFilePath = "/path/to/wrong/file.html";
    const readFileStub = sinon
      .stub(fs, "readFile")
      .callsFake((path, options, callback) => {
        callback(new Error("Dosya bulunamadı"), null);
      });

    request(app)
      .get("/shared")
      .expect(500)
      .end((err, res) => {
        expect(readFileStub.calledOnce).to.be.true;
        readFileStub.restore();
        done(err);
      });
  });
});
