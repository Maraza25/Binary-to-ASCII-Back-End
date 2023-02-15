//Kütüphaneler
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { log } = require("console");
const app = express();
const port = 3005;

app.use(cors()); //güvenlik için
app.use(express.json());

//static dosyalaar (Web Klasörü)

app.use(express.static("web"));

// urlde herhangi bir istek gelmezse
app.get("/", (req, res) => {
  //dosyalardan index.html yi bul
  const filePath = path.join(__dirname, "web", "index.html");
  /*
   anonymous function bir giriş argümanı alır işlem yapar ve sonuçlarını döndürür
  fs.readFile adlı bir fonksiyon çağrıldığında, bu anonymous function verilen filePath yani index.html 
  dosyasına göre dosyayı okumaya çalışır. 
  !Eğer dosya okuma işlemi sırasında bir hata oluşursa, err parametresine bu hayatı verir*/

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

//  arkplanda /wsubmit diye istek gönderilirse
app.post("/convert", (req, res) => {
  //boyd'de value ve type diye tamınlanan verileri konsola yazdır
  console.log(req.body.value);
  console.log(req.body.sourceType);
  console.log(req.body.destType);
  //geri dönderilicek mesahın tutulmasın için değişken
  let message = "";

  if (req.body.sourceType == "binary" && req.body.destType == "ascii") {
    message = binaryToAscii(req.body.value).toString();
  }
  if (req.body.sourceType == "binary" && req.body.destType == "octal") {
    message = binaryToOctal(req.body.value).toString();
  }

  if (req.body.sourceType == "ascii" && req.body.destType == "binary") {
    message = asciiToBinary(req.body.value).toString();
  }
  if (req.body.sourceType == "ascii" && req.body.destType == "octal") {
    message = asciiToOctal(req.body.value).toString();
  }

  if (req.body.sourceType == "octal" && req.body.destType == "binary") {
    message = octalToBinary(req.body.value).toString();
  }
  if (req.body.sourceType == "octal" && req.body.destType == "ascii") {
    message = octalToAscii(req.body.value).toString();
  }

  //message değişkenini karşı tarafa gönder
  res.send({ message });
  //message: "Success!"i karşı tarafa gönder
  res.send({ message: "Success!" });
});

//sunucuyu dinlemeye başla
app.listen(port, () => {
  //sunucu dinlenmeye başladığında localhos dinleniyor diye console yazdır
  console.log(`Server listening at http://localhost:${port}`);
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
