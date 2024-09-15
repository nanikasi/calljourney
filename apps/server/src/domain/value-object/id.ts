export class ID {
  private _value: string;

  constructor(id: string) {
    this._value = id;
  }

  public static generate() {
    return new ID(crypto.randomUUID());
  }

  public value() {
    return this._value;
  }

  public equals(other: ID) {
    return this._value === other.value();
  }
}
