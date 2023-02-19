//Kütüphaneler
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const app = express();
const querystring = require("querystring");
const http = require("http");

const cheerio = require("cheerio"); //html'i ayrıştırma için

const server = http.createServer(app);

const port = 3000;

const filePath = path.join(__dirname, "web", "index.html");

let sourceType;
let destType;
let value;

app.use(cors()); //güvenlik için
app.use(express.json());

//static dosyalaar (Web Klasörü)

app.use(express.static("web"));

// urlde herhangi bir istek gelmezse
app.get("/", (req, res) => {
  //dosyalardan index.html yi bul

  fs.readFile(filePath, "utf8", (err, data) => {
    //dosyayı utf8 ile oku
    //dosya okunurken bir hata oluşursa
    if (err) {
      // hata konsoluna oluşan hatayı yazdır
      console.error(err);
      // Internal Server Error olarak gönder
      res.sendStatus(500);
      return; //fonksiyondan çık
    }

    res.send(data); //index.html yi gönder
  });
});

app.get("/shared", (req, res) => {
  sourceType = req.query.sourceType;
  destType = req.query.destType;
  value = req.query.value;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred");
    }

    const $ = cheerio.load(data);
    $("#textbox").val(convertMessage(sourceType, destType, value));
    $("#value").val(value).prop("disabled", true);
    $("#sourceType").val(sourceType).prop("disabled", true);
    $("#destType").val(destType).prop("disabled", true);

    const existingDiv = $("div.container"); // Var olan div öğesini seç
    const newButton = $(
      "<button class='button' onclick='changePage()'>Try Yourself</button>"
    ); // Yeni bir button öğesi oluştur
    existingDiv.append(newButton); // Div öğesinin içine butonu ekle

    const modifiedHtml = $.html();
    res.send(modifiedHtml);
  });
});

//  arkplanda /wsubmit diye istek gönderilirse
app.post("/convert", (req, res) => {
  //boyd'de value ve type diye tamınlanan verileri konsola yazdır
  console.log(req.body.value);
  console.log(req.body.sourceType);
  console.log(req.body.destType);
  // Örnek olarak, aldığınız verileri bir değişkene atayalım
  const sourceType = req.body.sourceType;
  const destType = req.body.destType;
  const value = req.body.value;

  // Dönüştürülecek verileri hazırlayın
  const convertedData = {
    sourceType: sourceType,
    destType: destType,
    value: value,
  };

  // Verileri URL formatına dönüştürün
  const url =
    "http://localhost:3008/shared?" + querystring.stringify(convertedData);

  // URL'yi konsola yazdırın
  console.log(url);

  console.log(`Gelen verinin tamamı: ${req.body}`);
  //geri dönderilicek mesahın tutulmasın için değişken
  let message = convertMessage(sourceType, destType, value);

  //message ve url değişkenini karşı tarafa gönder
  res.send({ message: message, url: url, body: req.body });
});

//url ile gelinirse
app.get("/convert", (req, res) => {
  sourceType = req.query.sourceType;
  destType = req.query.destType;
  value = req.query.value;

  console.log("sourceType:", sourceType);
  console.log("destType:", destType);
  console.log("value:", value);

  // dosyalardan index.html'yi bul
  const filePath = path.join(__dirname, "web", "index.html");
  fs.readFile(filePath, "utf8", (err, data) => {
    // dosyayı utf8 ile oku
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    // yanıt verisini gönder
    res.send(data);
  }); //index.html'yi gönder
});

function asciiToBinary(str) {
  let binary = "";
  for (let i = 0; i < str.length; i++) {
    let ascii = str.charCodeAt(i);
    let binaryDigit = ascii.toString(2);
    binary += ("00000000" + binaryDigit).slice(-8); // 8 bitlik tamamlama
  }
  return binary;
}

function binaryToAscii(binary) {
  let str = "";
  for (let i = 0; i < binary.length; i += 8) {
    let binaryDigit = binary.substr(i, 8);
    let ascii = parseInt(binaryDigit, 2);
    str += String.fromCharCode(ascii);
  }
  return str;
}

function asciiToOctal(str) {
  let octal = "";
  for (let i = 0; i < str.length; i++) {
    let ascii = str.charCodeAt(i);
    let octalDigit = ascii.toString(8);
    octal += ("000" + octalDigit).slice(-3); // 3 bitlik tamamlama
  }
  return octal;
}

function octalToAscii(octal) {
  let str = "";
  for (let i = 0; i < octal.length; i += 3) {
    let octalDigit = octal.substr(i, 3);
    let ascii = parseInt(octalDigit, 8);
    str += String.fromCharCode(ascii);
  }
  return str;
}

// octalToBinary fonksiyonu, bir oktal sayıyı ikili sayıya dönüştürür
function octalToBinary(octal) {
  let decimal = parseInt(octal, 8); // önce onluk sayıya dönüştür
  let binary = decimal.toString(2); // sonra ikili sayıya dönüştür
  return binary;
}

// binaryToOctal fonksiyonu, bir ikili sayıyı oktal sayıya dönüştürür
function binaryToOctal(binary) {
  let decimal = parseInt(binary, 2); // önce onluk sayıya dönüştür
  let octal = decimal.toString(8); // sonra oktal sayıya dönüştür
  return octal;
}

function convertMessage(sourceType, destType, value) {
  let message = "";

  if (sourceType == "binary" && destType == "ascii") {
    message = binaryToAscii(value).toString();
  }
  if (sourceType == "binary" && destType == "octal") {
    message = binaryToOctal(value).toString();
  }

  if (sourceType == "ascii" && destType == "binary") {
    message = asciiToBinary(value).toString();
  }
  if (sourceType == "ascii" && destType == "octal") {
    message = asciiToOctal(value).toString();
  }

  if (sourceType == "octal" && destType == "binary") {
    message = octalToBinary(value).toString();
  }
  if (sourceType == "octal" && destType == "ascii") {
    message = octalToAscii(value).toString();
  }

  return message;
}

module.exports = app;
