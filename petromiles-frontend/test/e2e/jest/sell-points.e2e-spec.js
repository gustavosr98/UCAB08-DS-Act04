import { Builder, By, Key, until } from "selenium-webdriver";

jest.setTimeout(3000000);

describe("[E2E] As a client I want to exchange points so I can get its dollar equivalent into my bank account", () => {
  let driver;
  let vars;

  beforeEach(async () => {
    driver = await new Builder().forBrowser("firefox").build();
    vars = {};
  });

  afterEach(async () => {
    await driver.quit();
  });

  it("[Selenium] on Firefox", async () => {
    await driver.get("https://petromiles-frontend.herokuapp.com/");
    await driver
      .manage()
      .window()
      .setRect(1382, 744);
    await driver.findElement(By.id("input-27")).click();
    await driver
      .findElement(By.id("input-27"))
      .sendKeys("jaandrade.17@est.ucab.edu.ve");
    await driver.findElement(By.id("password")).click();
    await driver.findElement(By.id("password")).sendKeys("prueba1234");
    await driver.findElement(By.css(".theme--dark")).click();
    await driver.wait(
      until.elementLocated(
        By.css("div:nth-child(2) > .v-main .v-app-bar__nav-icon .v-icon")
      )
    );
    await driver.sleep(10000).then(async function() {});
    await driver
      .findElement(
        By.css("div:nth-child(2) > .v-main .v-app-bar__nav-icon .v-icon")
      )
      .click();
    await driver
      .findElement(
        By.css(
          "div:nth-child(2) > .v-main:nth-child(1) > .v-main__wrap:nth-child(1) > div:nth-child(1) .v-list-item:nth-child(5) .v-list-item__title:nth-child(1)"
        )
      )
      .click();
    await driver.wait(until.elementLocated(By.id("input-197")));
    await driver.sleep(10000).then(async function() {});
    await driver.findElement(By.id("input-197")).click();
    await driver.findElement(By.id("input-197")).sendKeys("2000");
    await driver.findElement(By.css(".v-select__selections")).click();
    await driver.findElement(By.id("list-item-228-0")).click();
    await driver.findElement(By.css(".col .v-btn__content")).click();
    await driver.findElement(By.css(".success > .v-btn__content")).click();

    await driver.wait(
      until.elementLocated(By.css(".v-btn--router > .v-btn__content"))
    );
    await driver
      .findElement(By.css(".v-btn--router > .v-btn__content"))
      .click();
  });
});
