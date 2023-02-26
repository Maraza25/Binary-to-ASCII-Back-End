const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const fetch = require("node-fetch");

describe("denmee", function () {
  this.timeout(30000);
  let driver;
  let vars;
  beforeEach(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    vars = {};
  });
  afterEach(async function () {
    await driver.quit();
  });
  it("denmee", async function () {
    await driver.get("http://localhost:3000/");
    await driver.manage().window().setRect({ width: 958, height: 816 });
    await driver.findElement(By.id("value")).click();
    await driver.findElement(By.id("value")).sendKeys("ahmet");
    await driver.findElement(By.css("button:nth-child(5)")).click();
//     const response = await fetch(
//       "http://127.0.0.1:6027/shared?sourceType=ascii&destType=binary&value=ahmet"
//     );
//     const data = await response.json();
//     const textarea = await driver.findElement(By.id("textbox"));
//     const textareaValue = await textarea.getAttribute("value");
//     if (textareaValue === data.message) {
//       console.log("Değerler eşit.");
//     } else {
//       console.log("Değerler farklı.");
//     }
  });
});
  
