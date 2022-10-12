import { Page, chromium,Browser } from 'playwright';
import './main';




describe('Login', () => {
  let page: Page;
  let browser:Browser;
  beforeAll(async () => {
    const browser = await chromium.launch();
    page = await browser.newPage();
  })

  // it('should display "Login" text on title', async () => {
  //   await page.goto('http://localhost:8080')
  //   const title = await page.title();
  //   expect(title).toContain('Pixel Farm');
  // });

  // it('should successfully login', async () => {
  //   await page.goto('http://localhost:8080')
  //   await page.evaluate(() => {
  //     const username = document.querySelector('[name=username]');
  //     const password = document.querySelector('[name=password]');
  //     if (username && password) {
  //       (username as HTMLInputElement).value = "tecky";
  //       (password as HTMLInputElement).value = "tecky";
  //     }
  //     const submit = document.querySelector('[type=submit]');
  //     if (submit) {
  //       (submit as HTMLInputElement).click();
  //     }
  //   });
  //   const studentMain = await page.evaluate(() => document.querySelector('#student-main'));
  //   expect(studentMain).toBeDefined();
  // })



  test('test', async () => {
    // Go to http://localhost:8080/
    await page.goto('http://localhost:8080/');
    // Click input:has-text("Login")
    await page.locator('input:has-text("Login")').click();
    await expect(page.url()).toEqual('http://localhost:8080/login.html');
    // Click [placeholder="Email"]
    await page.locator('[placeholder="Email"]').click();
    // Fill [placeholder="Email"]
    await page.locator('[placeholder="Email"]').fill('1@gmail.com');
    // Press Tab
    await page.locator('[placeholder="Email"]').press('Tab');
    // Fill [placeholder="Password"]
    await page.locator('[placeholder="Password"]').fill('1');
    // Press Enter
    page.once('dialog', dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      dialog.dismiss().catch(() => { });
    });

 
    await page.locator('[placeholder="Password"]').press('Enter');
    await expect(page.url()).toEqual('http://localhost:8080/game.html');
    // Click text=Close
    await page.locator('text=Close').click();
    // Click text=Player Info
    await page.locator('text=Player Info').click();
    // Click text=Hello! player1
    await page.frameLocator('#innerFrameContent').locator('text=Hello! player1').click();
  });

});

