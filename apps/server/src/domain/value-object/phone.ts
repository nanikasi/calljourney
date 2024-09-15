class Phone {
  private _phoneNumber: string;

  constructor(number: string) {
    if (!number) {
      throw new Error("phone is required");
    }

    if (!Phone.isValid(number)) {
      throw new Error("Email is invalid");
    }

    this._phoneNumber = number;
  }

  get full(): string {
    return this._phoneNumber;
  }

  public static isValid(number: string): boolean {
    // See: https://akinov.hatenablog.com/entry/2017/05/31/194421
    return /\A(((0(\d{1}[-(]?\d{4}|\d{2}[-(]?\d{3}|\d{3}[-(]?\d{2}|\d{4}[-(]?\d{1}|[5789]0[-(]?\d{4})[-)]?)|\d{1,4}\-?)\d{4}|0120[-(]?\d{3}[-)]?\d{3})\z/.test(
      number,
    );
  }
}
