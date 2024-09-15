export class Email {
  private _emailAddress: string;

  constructor(email: string) {
    if (!email) {
      throw new Error("Email is required");
    }

    if (Email.isValid(email) === false) {
      throw new Error("Email is invalid");
    }

    this._emailAddress = email;
  }

  get full(): string {
    return this._emailAddress;
  }

  get domain(): string {
    return this._emailAddress.split("@")[1];
  }

  public static isValid(email: string): boolean {
    return /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/.test(
      email,
    );
  }
}
