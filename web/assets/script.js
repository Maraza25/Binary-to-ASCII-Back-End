function submitForm(event) {
  event.preventDefault();
  const value = document.querySelector("#value").value;

  // Kaynak tipi form öğesi değerini al
  const sourceType = document.getElementById("sourceType");
  const sourceTypeValue = sourceType.value;
  console.log("Kaynak tipi form öğesi değeri: " + sourceTypeValue);

  // Hedef tipi form öğesi değerini al
  const destType = document.getElementById("destType");
  const destTypeValue = destType.value;
  console.log("Hedef tipi form öğesi değeri: " + destTypeValue);

  fetch("http://localhost:3005/convert", {
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
      document.querySelector("textarea").value = data.message;
    })
    .catch((error) => console.error(error));
}

function kopyala() {
  var metin = document.getElementById("textbox");
  metin.sourceType();
  document.execCommand("copy");
}

function paylas(value,sourceTypeValue,destTypeValue) {

  navigator.clipboard.writeText(value);


}
