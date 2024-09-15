export class Phone {
  private _phoneNumber: string;

  constructor(number: string) {
    if (!number) {
      throw new Error("phone is required");
    }

    if (!Phone.isValid(number)) {
      throw new Error("Phone is invalid");
    }

    this._phoneNumber = number;
  }

  get international(): string {
    return `+81${this._phoneNumber.slice(1)}`;
  }
  get local(): string {
    return this._phoneNumber;
  }

  public static isValid(number: string): boolean {
    // See: https://akinov.hatenablog.com/entry/2017/05/31/194421
    return /^(0{1}\d{9,11})$/.test(number);
  }
}
