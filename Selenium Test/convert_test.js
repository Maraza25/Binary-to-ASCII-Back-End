const { Builder, By, Key, until } = require("selenium-webdriver");
const assert = require("assert");
const fetch = require("node-fetch");
const { Driver } = require("selenium-webdriver/chrome");

describe("deneme", function () {
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
  
  it("deneme", async function () {
    await driver.get("http://localhost:3000/");
    await driver.manage().window().setRect({ width: 958, height: 816 });
    await driver.findElement(By.id("value")).click();
    await driver.findElement(By.id("value")).sendKeys("ahmet");
    await driver.findElement(By.css("button:nth-child(5)")).click();
    setTimeout(function() {
      // Belirli bir süre sonra bu kod bloğu çalışacak
    }, 5000);
    

    // POST isteği gönder
    const response = await fetch('http://127.0.0.1:6027/convert?sourceType=ascii&destType=binary&value=ahmet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceType: 'ascii', destType: 'binary', value: 'ahmet' })
    });
    const data = await response.json();
    

    // Textarea elementinin değerini al ve karşılaştır
    const textarea = await driver.findElement(By.id('textbox'));

    console.log(textarea.value);
    
    assert.strictEqual(textarea.value, data.message, 'Değerler farklı.');
  });
});
