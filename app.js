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
    "http://localhost:"+port+"/shared?" + querystring.stringify(convertedData);

  // URL'yi konsola yazdırın
  console.log(url);

  console.log(`Gelen verinin tamamı: ${req.body}`);
  //geri dönderilicek mesahın tutulmasın için değişken
  let message = convertMessage(sourceType, destType, value);

  //message ve url değişkenini karşı tarafa gönder
  res.send({ message: message, url: url, body: req.body });
});



function asciiToBinary(str) {
  if (typeof str !== 'string') {
    throw new Error('Girdi bir dize olmalı');
  }

  // ASCII karakterleri içerip içermediğini kontrol et
  if (!/^[\x00-\x7F]*$/.test(str)) {
    throw new Error('Girdi sadece ASCII karakterlerini içermeli');
  }

  let binary = '';
  for (let i = 0; i < str.length; i++) {
    // her karakterin ASCII kodunu bul
    let ascii = str.charCodeAt(i);

    // ASCII kodunu ikilik sayı sistemine dönüştür
    let current = '';
    for (let j = 7; j >= 0; j--) {
      current += (ascii >> j & 1);
    }

    binary += current;
    if (i < str.length - 1) {
      binary += ''; // iki karakter arasına iki boşluk bırak
    }
  }

  // Her ikili sayının arasına tek boşluk bırak
  binary = binary.replace(/(\d{8})/g, '$1 ');

  // String'in sonundaki boşluğu kaldır
  binary = binary.trim();

  return binary;
}

function asciiToOctal(str) {
  if (typeof str !== 'string') {
    throw new Error('Girdi bir dize olmalı');
  }

  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127) {
      throw new Error('Girdi sadece ASCII karakterlerini içermeli');
    }
  }

  let result = '';
  for (let i = 0; i < str.length; i++) {
    const octal = str.charCodeAt(i).toString(8);
    result += ('000' + octal).slice(-3) + ' ';
  }

  return result.trim();
}

function binaryToAscii(str) {
  if (typeof str !== 'string') {
    throw new Error('Girdi bir dize olmalı');
  }

  const binaryArr = str.split(' ');

  for (let i = 0; i < binaryArr.length; i++) {
    const binary = binaryArr[i];
    if (!/^[01]+$/.test(binary)) {
      throw new Error('Geçersiz binary dizesi');
    }
    binaryArr[i] = parseInt(binary, 2);
  }

  return String.fromCharCode(...binaryArr);
}

function binaryToOctal(binary) {
  if (typeof binary !== 'string') {
    console.log('Girdi bir dize olmalı');
    throw new Error('Girdi bir dize olmalı');
  }

  // Girdinin geçerli bir binary dizisi olduğunu kontrol etmek için düzenli ifade kullanıyoruz
  if (!/^[01 ]+$/.test(binary)) {
    console.log('Geçersiz binary dizesi');
    throw new Error('Geçersiz binary dizesi');
  }

  // Girdiyi boşluk karakterlerinden ayırarak bir diziye dönüştürüyoruz
  const binaryArray = binary.split(' ');

  // Her binary sayısını ondalık sayıya dönüştürüyoruz
  const decimalArray = binaryArray.map(binaryStr => parseInt(binaryStr, 2));

  // Her ondalık sayıyı octal sayıya dönüştürüyoruz
  const octalArray = decimalArray.map(decimal => decimal.toString(8));

  // Octal sayıları birleştirerek sonucu döndürüyoruz
  return octalArray.join(' ');
}

function octalToAscii(octal) {
  if (typeof octal !== 'string') {
    throw new Error('Girdi bir dize olmalı');
  }

  // Girdinin sadece octal sayılarını içerdiğinden emin oluyoruz
  if (!/^[0-7 ]+$/.test(octal)) {
    throw new Error('Geçersiz octal dizesi');
  }

  // Her octal sayısını ondalık sayıya dönüştürüyoruz
  const decimalArray = octal.split(' ').map(octalStr => parseInt(octalStr, 8));

  // Her ondalık sayıyı ASCII karakterine dönüştürüyoruz
  const asciiArray = decimalArray.map(decimal => String.fromCharCode(decimal));

  // ASCII karakterleri birleştirerek sonucu döndürüyoruz
  return asciiArray.join('');
}

function octalToBinary(octal) {
  if (typeof octal !== 'string') {
    throw new Error('Girdi bir dize olmalı');
  }
  if (!/^[0-7 ]+$/.test(octal)) {
    throw new Error('Geçersiz octal dizesi');
  }
  let binary = '';
  for (let i = 0; i < octal.length; i++) {
    if (octal[i] === ' ') {
      binary += ' ';
      continue;
    }
    let decimal = parseInt(octal[i], 8);
    let binarySegment = decimal.toString(2);
    while (binarySegment.length < 3) {
      binarySegment = '0' + binarySegment;
    }
    binary += binarySegment;
  }
  return binary;
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

module.exports = {
  app,
  asciiToBinary,
  binaryToAscii,
  asciiToOctal,
  octalToAscii,
  octalToBinary,
  binaryToOctal,
  convertMessage,
};
