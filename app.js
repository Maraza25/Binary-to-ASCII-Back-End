//Kütüphaneler
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3005;

app.use(cors()); //güvenlik için
app.use(express.json());

// urlde /web/asset/... diye istek gelirse gelen isteği alma
app.get("/web/assets/:input", (req, res) => {
  if (req.params.input == "style.css") {
    // web/assets/style.css dosyasını gönder
    res.sendFile(path.join(__dirname, "web/assets/style.css"), {
      //headersinni text/css yap
      headers: { "Content-Type": "text/css" },
    });
  }
  //gelen istek style.css e eşitse(js e eşitse)
  else {
    //web/assets/script.js dosyasını gönder
    res.sendFile(path.join(__dirname, "web/assets/scriot.js"), {
      //headersinni text/js yap
      headers: { "Content-Type": "text/js" },
    });
  }
});

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
app.post("/submit", (req, res) => {
  //boyd'de value ve type diye tamınlanan verileri konsola yazdır
  console.log(req.body.value);
  console.log(req.body.type);
  //geri dönderilicek mesahın tutulmasın için değişken
  let message = "";

  //body'den gelen type verisi ascii ye eşitse
  if (req.body.type == "ascii") {
    //message değişkenini asciiToBinar fonkisyonuna gönderilen value bilgisinin karşılığını ata
    message = asciiToBinary(req.body.value).toString();
  }

  //body'den gelen type verisi binary ye eşitse
  if (req.body.type == "binary") {
    //message değişkenini binaryToAcsii fonkisyonuna gönderilen value bilgisinin karşılığını ata
    message = binaryToAscii(req.body.value).toString();
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
  var result = [];
  for (var i = 0; i < str.length; i++) {
    result.push(str.charCodeAt(i).toString(2));
  }
  return result.join(" ");
}

function binaryToAscii(binary) {
  binary = binary.split(" ");
  var result = "";
  for (var i = 0; i < binary.length; i++) {
    result += String.fromCharCode(parseInt(binary[i], 2));
  }
  return result;
}
