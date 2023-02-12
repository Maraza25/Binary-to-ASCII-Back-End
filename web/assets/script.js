function submitForm(event) {
    event.preventDefault();
    const value = document.querySelector("#value").value;
    var select = document.getElementById("type");
    var selectedOption = select.options[select.selectedIndex].value;
    console.log(selectedOption);
  
    fetch("http://localhost:3005/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({value:value, type: selectedOption }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.querySelector("textarea").value = data.message;
    })
    .catch((error) => console.error(error));
  }

  function kopyala(){
    var metin = document.getElementById("textbox");
    metin.select();
    document.execCommand("copy");
} 




  