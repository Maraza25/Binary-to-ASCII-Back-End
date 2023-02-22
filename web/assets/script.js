function submitForm(
  event,
  value = document.querySelector("#value").value,
  sourceTypeValue = document.getElementById("sourceType").value,
  destTypeValue = document.getElementById("destType").value
) {
  event.preventDefault();
  document.querySelector("#value").value = value;

  console.log("Kaynak tipi form öğesi değeri: " + sourceTypeValue);

  console.log("Hedef tipi form öğesi değeri: " + destTypeValue);

  fetch("http://localhost:3000/convert", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      value: value,
      sourceType: sourceTypeValue,
      destType: destTypeValue,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      changeTextareaValue(data.message);
      url = data.url;
    })
    .catch((error) => console.error(error));
}

function copyToClipboard(str=document.getElementById("textbox").value) {
  navigator.clipboard
    .writeText(str)
    .then(() => {
      console.log(`'${str}' copied to clipboard.`);
    })
    .catch((err) => {
      console.error(`Error in copying text: ${err}`);
    });
}

var paylasButonu = document.getElementById("paylas_button");
var title = "Paylaşılacak İçerik";
var text = "Bu içeriği paylaşın";
var url = "";

if (navigator.share) {
   function paylasButonu () {
    navigator
      .share({
        title: title,
        text: text,
        url: url,
      })
      .then(() => console.log("İçerik paylaşıldı"))
      .catch((err) => console.error("Paylaşım hatası:", err));
  }
} else {
  // TODO: Paylaş butonu varsayılan olarak gizli olsun
  // öbür türlü sayfa açıldığında kısa bir süreliğine de olsa görünüyor
  // ve bir anda kayboluyor, hoş bir görüntü değil
  paylasButonu.style.display = "none"; 
  console.log("Bu cihazda paylaşım işlemi desteklenmiyor.");
}

function changeTextareaValue(value) {
  // textarea elementini seç
  let textarea = document.querySelector("textarea");
  // orijinal rengini al
  let originalColor = getComputedStyle(textarea).color;

  // textarea içeriğini değiştir
  textarea.value = value;

  // her bir karakter için döngü
  let chars = textarea.value.split("");
  chars.forEach((char, index) => {
    // karakterin rengini değiştir ve tekrar eski rengine döndür
    setTimeout(() => {
      // karakterin yerini seç
      textarea.setSelectionRange(index, index + 1);
      // karakterin rengini mor olarak değiştir
      textarea.style.color = "red";
      // 0.5 saniye sonra karakterin rengini eski rengine döndür
      setTimeout(() => {
        textarea.style.color = originalColor;
      }, 1000);
    }, index * 0);
  });
}

function changePage() {
  // yeni sayfa için URL oluşturma
  const newUrl = "/";

  // dosyadaki HTML içeriğini almak için fetch() API'sini kullanma
  fetch("/")
    .then((response) => response.text())
    .then((html) => {
      // yeni URL'yi ve HTML içeriğini tarayıcı geçmişine ekleyerek sayfayı değiştirme
      window.history.pushState({}, "", newUrl);
      document.documentElement.innerHTML = html;
    });
}
