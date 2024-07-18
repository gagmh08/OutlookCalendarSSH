const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { CalendarPage } = require("../pageobjects/CalendarPage");
const { CalendarPage2 } = require("../pageobjects/CalendarPage2");

test("Create new outlook calender", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const calendarPage = new CalendarPage(page);
  const username = "messicopaamerica2024@outlook.com";
  const password = "Balondeoro10";

  test.setTimeout(1200000);

  //Navigate to outlook email page
  await loginPage.goTo();

  //Enter user credentials
  await loginPage.validLogin(username, password);

  //Navigate to calendar view
  await calendarPage.navigateToCalendarView();
  //await page.waitForTimeout(5000);
  //await page.waitForLoadState();

  // Count the number of Initial calendars
  const initialCalendars = await calendarPage.countCalendars();
  console.log(
    `Total number of  initial calendars in the account: ${initialCalendars}`
  );
  //await page.waitForTimeout(500);

  //Add Blank Calendar
  await calendarPage.navigateToBlankCalendar();

  //Creat Calendars
  const numberOfCalendarsToCreate = 20;
  const createdCalendars = [];
  let i = 1;

  while (createdCalendars.length < numberOfCalendarsToCreate) {
    let calendarName = `Movies ${i}`;
    if (await calendarPage.calendarExists(calendarName)) {
      i++;
    } else {
      await calendarPage.createCalendar(calendarName);
      createdCalendars.push(calendarName);

      i++;
    }

    await page.waitForTimeout(500);
  }

  // Assert the quantity of calendars created
  expect(createdCalendars.length).toBe(numberOfCalendarsToCreate);
  console.log(`Number of calendars created: ${createdCalendars.length}`);

  // Print created calendars
  console.log("Created Calendars:", createdCalendars);

  // Verify the names of the created calendars
  //for (const calendarName of createdCalendars) {
   // const exists = await calendarPage.calendarExists(calendarName);
   // expect(exists).toBe(true);
 // }

  // Count the total number of calendars
  const totalCalendars = await calendarPage.countCalendars();
  console.log(`Total number of calendars in the account: ${totalCalendars}`);
});

test(" Keep Create new outlook calender", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const calendarPage = new CalendarPage(page);
  const username = "messicopaamerica2024@outlook.com";
  const password = "Balondeoro10";

  test.setTimeout(120000000000);

  //Navigate to outlook email page
  await loginPage.goTo();

  //Enter user credentials
  await loginPage.validLogin(username, password);

  //Navigate to calendar view
  await calendarPage.navigateToCalendarView();
  await page.waitForTimeout(4000);
  //await page.waitForLoadState();

  // Count the number of Initial calendars
  const initialCalendars = await calendarPage.countCalendars();
  console.log(
    `Total number of  initial calendars in the account: ${initialCalendars}`
  );
  //await page.waitForTimeout(500);

  //Add Blank Calendar
  await calendarPage.navigateToBlankCalendar();

  
  

    await page.waitForTimeout(500);
  


  const numberOfCalendarsToCreate = 100;
  const createdCalendars = [];
  let i = 1;

  // Assert the quantity of calendars created
  expect(createdCalendars.length).toBe(numberOfCalendarsToCreate);
  console.log(`Number of calendars created: ${createdCalendars.length}`);

  // Print created calendars
  console.log("Created Calendars:", createdCalendars);

  // Verify the names of the created calendars
  for (const calendarName of createdCalendars) {
    const exists = await calendarPage.calendarExists(calendarName);
    expect(exists).toBe(true);

  }


  // Count the total number of calendars
  const totalCalendars = await calendarPage.countCalendars();
  console.log(`Total number of calendars in the account: ${totalCalendars}`);

});

test("Keep on Create new outlook calender", async ({ page }) => {

  const loginPage = new LoginPage(page);
  const calendarPage = new CalendarPage2(page);
  const username = "messicopaamerica2024@outlook.com";
  const password = "Balondeoro10";

  //const username = "verygoodcoffee2024@outlook.com";
 // const password = "Cafeo2024";

  test.setTimeout(36000000);
  

  //Navigate to outlook email page
  await loginPage.goTo();

  //Enter user credentials
  await loginPage.validLogin(username, password);

  //Navigate to calendar view
  await calendarPage.navigateToCalendarView();

  await calendarPage.navigateToBlankCalendar();

  for (let i = 999; i <= 1010; i++) {
    await calendarPage.createCalendar(`Movies ${i}`);
  }

  await page.waitForTimeout(500);

  // Count the total number of calendars
  const totalCalendars = await calendarPage.countCalendars();
  console.log(`Total number of calendars in the account: ${totalCalendars}`);

  //await browser.close();




});


test.only("Count outlook calender", async ({ page }) => {

  const loginPage = new LoginPage(page);
  const calendarPage = new CalendarPage2(page);
  const username = "messicopaamerica2024@outlook.com";
  const password = "Balondeoro10";

  //const username = "verygoodcoffee2024@outlook.com";
 // const password = "Cafeo2024";

  test.setTimeout(72000000);
  /*

  //Navigate to outlook email page
  await loginPage.goTo();

  //Enter user credentials
  await loginPage.validLogin(username, password);

  //Navigate to calendar view
  await calendarPage.navigateToCalendarView();

   // Count the total number of calendars
   const totalCalendars = await calendarPage.countCalendars();
   console.log(`Total number of calendars in the account: ${totalCalendars}`);
 
   //await browser.close();

   */

   try {
    // Navigate to outlook email page
    await loginPage.goTo();
    console.log("Navigated to login page");

    // Enter user credentials
    await loginPage.validLogin(username, password);
    console.log("Logged in successfully");

    // Navigate to calendar view
    await calendarPage.navigateToCalendarView();
    console.log("Navigated to calendar view");

    // Show all Calendars
    //await page.locator(".kOcfd").click();
    //await page.waitForTimeout(5000);


    // Count the total number of calendars
    const totalCalendars = await calendarPage.countCalendars();
    console.log(`Total number of calendars in the account: ${totalCalendars}`);
  } catch (error) {
    console.error("An error occurred during the test execution", error);
  }

});