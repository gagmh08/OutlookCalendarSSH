class CalendarPage {
  constructor(page) {
    this.page = page;
    this.calendarButton = page.locator('button[aria-label="Calendar"]');
    this.addCalendar = page.locator('button[title="Add calendar"]');
    this.createBlankCalendar = page.locator("#CreateCalendar");
    this.addCalendarName = page.getByPlaceholder("Calendar name");
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.existingCalendars = page.locator(".ATH58");
  }

  async navigateToCalendarView() {
    await this.calendarButton.click();
    await this.page.waitForTimeout(10000);
  }

  async navigateToBlankCalendar() {
    await this.addCalendar.click();
    await this.page.waitForTimeout(500);

    await this.createBlankCalendar.click();
    await this.page.waitForTimeout(500);
  }

  async createCalendar(calendarName) {
   await this.addCalendarName.fill(calendarName);
   //await this.page.waitForTimeout(200);
   await this.saveButton.click();
   await this.page.waitForTimeout(10000);

   
  }
  async calendarExists(calendarName) {
    const calendars = await this.existingCalendars.allTextContents();
    return calendars.includes(calendarName);

   
  }

  async countCalendars() {
    //await this.page.waitForSelector('.ATH58', { timeout: 10000 });
    const calendarElements = await this.existingCalendars.allTextContents();
    const count = calendarElements.length;
    //console.log(`Total number of calendars: ${count}`);
    return count;
  }
}

module.exports = { CalendarPage };
