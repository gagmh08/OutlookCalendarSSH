class CalendarPage2 {

    constructor(page) {
        this.page = page;
        this.calendarButton = page.locator('button[aria-label="Calendar"]');
        this.addCalendar = page.locator('button[title="Add calendar"]');
        this.createBlankCalendar = page.locator("#CreateCalendar");
        this.addCalendarName = page.getByPlaceholder("Calendar name");
        this.saveButton = page.getByRole("button", { name: "Save" });
        this.showAllCalendars = page.locator(".kOcfd");
        this.existingCalendars = page.locator(".ATH58");
      
    }
  
    async navigateToCalendarView() {
        await this.calendarButton.click();
        await this.page.waitForTimeout(100);
        await this.showAllCalendars.click();
        await this.page.waitForTimeout(10000000);

        
      }
    
      async navigateToBlankCalendar() {
        await this.addCalendar.click();
       // await this.page.waitForTimeout(10000);
        await this.page.waitForSelector('#CreateCalendar', { timeout: 60000 });
    
        await this.createBlankCalendar.click();
        //await this.page.waitForTimeout(10000);
        await this.page.waitForSelector(this.addCalendarName, { timeout: 60000 });
      }
    
      async createCalendar(calendarName) {
       await this.addCalendarName.fill(calendarName);
      
       await this.saveButton.click();
       //await this.page.waitForTimeout(1000);
       await this.page.waitForSelector('.ATH58', { timeout: 60000 }); // Wait for the calendar list to update
  }


  
  async countCalendars() {
    console.log("Counting calendars...");
    //await this.page.waitForSelector('.ATH58', { timeout: 600000 });
    const calendarElements = await this.existingCalendars.allTextContents();
    //console.log(`Total calendars found: ${calendarElements.length}`);
    return calendarElements.length;
  }


}
  
  module.exports = {CalendarPage2};