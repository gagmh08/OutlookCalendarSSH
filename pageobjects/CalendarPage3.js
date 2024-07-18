class CalendarPage3 {
    constructor(page) {
      this.page = page;
      this.calendarButton = page.locator('button[aria-label="Calendar"]');
      this.addCalendar = page.locator('button[title="Add calendar"]');
      this.createBlankCalendar = page.locator('#CreateCalendar');
      this.addCalendarName = page.getByPlaceholder('Calendar name');
      this.saveButton = page.getByRole('button', { name: 'Save' });
      this.existingCalendars = page.locator(".ATH58");
      this.calendarViewLoadedIndicator = page.locator('button[title="Add calendar"]');
      this.somethingWentWrong = page.locator('text=Something Went Wrong');
    }

    async navigateToCalendarView() {
        console.log("Navigating to calendar view...");
        await this.calendarButton.click();
        await this.page.waitForTimeout(10000);

        
      }
    
      async waitForCalendarViewToLoad() {
        console.log("Waiting for calendar view to load...");
        //await this.calendarViewLoadedIndicator.waitFor({ timeout: 600000 }); // Increase timeout to 5 minutes
        console.log("Calendar view loaded.");
      }
    
      async navigateToBlankCalendar(retries = 3) {
        for (let attempt = 0; attempt < retries; attempt++) {
          try {
            console.log(`Navigating to blank calendar creation, attempt ${attempt + 1}...`);
            await this.addCalendar.click();
            await this.page.waitForSelector('#CreateCalendar', { timeout: 20000 });
            await this.createBlankCalendar.click();
            await this.page.waitForSelector('[placeholder="Calendar name"]', { timeout: 20000 });
            console.log("Navigated to blank calendar creation.");
            return;
          } catch (error) {
            console.error(`Error navigating to blank calendar creation: ${error}`);
            if (await this.somethingWentWrong.isVisible()) {
              console.log("Detected 'Something Went Wrong' page, refreshing...");
              await this.page.reload();
            }
            if (attempt < retries - 1) {
              console.log("Retrying navigation to blank calendar creation...");
              await this.page.goBack(); // Go back instead of reload
              await this.waitForCalendarViewToLoad();
            } else {
              throw error;
            }
          }
        }
      }
    
      async createCalendar(calendarName) {
        console.log(`Creating calendar with name: ${calendarName}`);
        await this.addCalendarName.fill(calendarName);
        await this.saveButton.click();
        await this.page.waitForTimeout(200);
        console.log("Calendar created.");
        await this.page.waitForTimeout(1000);
      }
    
      async calendarExists(calendarName) {
        //console.log(`Checking if calendar exists: ${calendarName}`);
        await this.page.waitForSelector('.ATH58', { timeout: 20000 });
        const calendars = await this.existingCalendars.allTextContents();
       //console.log("Existing calendars:", calendars);
        return calendars.includes(calendarName);
      }
    
      async countCalendars() {
        console.log("Counting calendars...");
        await this.page.waitForSelector('.ATH58', { timeout: 200000 });
        const calendarElements = await this.existingCalendars.allTextContents();
        console.log(`Total calendars found: ${calendarElements.length}`);
        return calendarElements.length;
      }

      async getExistingCalendars() {
        await this.page.waitForSelector('.ATH58', { timeout: 200000 });
        return await this.existingCalendars.allTextContents();
      }

 
    }
  

  
  module.exports = { CalendarPage3 };