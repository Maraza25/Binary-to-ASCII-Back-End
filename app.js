//Kütüphaneler
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
const http = require("http");


const cheerio = require("cheerio"); //html'i ayrıştırma için

const server = http.createServer(app);

const port = 3000;

const filePath = path.join(__dirname, "web", "index.html");

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

  
  let converted
  const sourceType = req.query.sourceType;
  const destType = req.query.destType;
  const value = req.query.value;

  const data = {
    sourceType: sourceType,
    destType: destType,
    value: value
  };


  fetch("http://127.0.0.1:6027/convert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      converted = data.message;
      console.log(converted);
    })
    .catch((error) => console.error(error));

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred");
    }

    const $ = cheerio.load(data);
    $("#textbox").val(converted);
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

app.use(function(req, res, next) {
  res.status(404).send("404 Page Not Found");
  next();
});


module.exports = { app };
