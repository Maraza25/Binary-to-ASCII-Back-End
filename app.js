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


module.exports = { app }
