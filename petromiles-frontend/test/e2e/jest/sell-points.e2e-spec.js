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
    await driver.get("http://localhost:8081/sell-points");
    await driver
      .manage()
      .window()
      .setRect(960, 1053);
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
    await driver.findElement(By.id("withdraw-points-input")).click();
    await driver.findElement(By.id("withdraw-points-input")).sendKeys("5000");
    await driver.findElement(By.css(".v-select__selections")).click();
    await driver.findElement(By.xpath("//body/div/div[2]/div/div")).click();
    await driver.findElement(By.css(".col .v-btn__content")).click();
    await driver.findElement(By.css(".success > .v-btn__content")).click();
    await driver
      .findElement(By.css(".v-btn--router > .v-btn__content"))
      .click();
    await driver.executeScript("window.scrollTo(0,0)");
  });
});
