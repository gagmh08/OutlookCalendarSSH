class LoginPage {
  constructor(page) {
    this.page = page;

    this.userName = page.getByPlaceholder("Email, phone, or Skype");
    this.userPassword = page.getByPlaceholder("Password");
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.SignInButton = page.locator("#idSIButton9");
    //this.noteButton = page.getByRole("button", {name: 'OK'});
    this.dontShowCheck = page.locator("#checkboxField");
    this.noButton = page.locator("#declineButton");
  }
  async goTo() {
    await this.page.goto(
      "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=155&ct=1720789892&rver=7.0.6738.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fowa%2f%3fcobrandid%3dab0455a0-8d03-46b9-b18b-df2f57b9e44c%26nlp%3d1%26deeplink%3dowa%252f%253frealm%253doutlook.com%26RpsCsrfState%3d7bd549ee-eca7-c12c-eee9-b99cd97e4518&id=292841&aadredir=1&whr=outlook.com&CBCXT=out&lw=1&fl=dob%2cflname%2cwld&cobrandid=ab0455a0-8d03-46b9-b18b-df2f57b9e44c"
    );
  }

  async validLogin(username, password) {
    await this.userName.fill(username);
    await this.nextButton.click();
    await this.userPassword.fill(password);
    await this.SignInButton.click();

    await this.dontShowCheck.check();

    await this.noButton.click();
  }
}
module.exports = { LoginPage };
