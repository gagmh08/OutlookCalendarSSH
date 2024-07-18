const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../pageobjects/LoginPage");
const { CalendarPage3 } = require("../pageobjects/CalendarPage3");

test("Create new Outlook calendar", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const calendarPage = new CalendarPage3(page);
  const username = "messicopaamerica2024@outlook.com";
  const password = "Balondeoro10";

  test.setTimeout(1800000); 

  // Navigate to Outlook email page and log in
  await loginPage.goTo();
  await loginPage.validLogin(username, password);

  // Navigate to calendar view and wait for it to load
  await calendarPage.navigateToCalendarView();
  await calendarPage.waitForCalendarViewToLoad();

  // Count the initial number of calendars
  const initialCalendars = await calendarPage.countCalendars();
  console.log(`Total number of initial calendars in the account: ${initialCalendars}`);

  // Get existing calendar names
  const existingCalendars = await calendarPage.getExistingCalendars();
 // console.log("Existing Calendars:", existingCalendars);

  // Add Blank Calendar
  await calendarPage.navigateToBlankCalendar();

  

  // Create Calendars
  const numberOfCalendarsToCreate = 20;
  const createdCalendars = [];
  let i = 1;

  console.log("Starting calendar creation...");

  /*
  while (createdCalendars.length < numberOfCalendarsToCreate) {
    let calendarName = `Movies ${i}`;
    if (await calendarPage.calendarExists(calendarName)) {
      i++;
    } else {
      await calendarPage.createCalendar(calendarName);
      createdCalendars.push(calendarName);
      i++;
    }
    await page.waitForTimeout(500); // Wait for 0.5 seconds to avoid overwhelming the server
  }
    */

  while (createdCalendars.length < numberOfCalendarsToCreate) {
    let calendarName = `Movies ${i}`;
    if (existingCalendars.includes(calendarName)) {
      //console.log(`Calendar with name ${calendarName} already exists.`);
      i++;
    } else {
      await calendarPage.createCalendar(calendarName);
      createdCalendars.push(calendarName);
      i++;
    }
    await page.waitForTimeout(2000); // Wait for 2 seconds to avoid overwhelming the server
  }

  // Assert the quantity of calendars created
  expect(createdCalendars.length).toBe(numberOfCalendarsToCreate);
  console.log(`Number of calendars created: ${createdCalendars.length}`);
  console.log("Created Calendars:", createdCalendars);

  // Verify the names of the created calendars
  //for (const calendarName of createdCalendars) {
    //console.log(`Verifying calendar: ${calendarName}`);
    //const exists = await calendarPage.calendarExists(calendarName);
    //expect(exists).toBe(true);
  //}

   // Retry mechanism for verification
   for (const calendarName of createdCalendars) {
    await verifyCalendarExists(calendarPage, calendarName);
  }

  // Count the total number of calendars
  const totalCalendars = await calendarPage.countCalendars();
  console.log(`Total number of calendars in the account: ${totalCalendars}`);
});

async function verifyCalendarExists(calendarPage, calendarName, retries = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      console.log(`Verifying calendar: ${calendarName}, attempt ${attempt + 1}`);
      const exists = await calendarPage.calendarExists(calendarName);
      if (exists) {
        console.log(`Calendar ${calendarName} verified.`);
        expect(exists).toBe(true);
        return;
      }
      console.log(`Calendar ${calendarName} not found, retrying...`);
      await calendarPage.page.waitForTimeout(5000); // Wait for 5 seconds before retrying
    }
    throw new Error(`Failed to verify calendar: ${calendarName}`);
  }