import type { Entity } from "../../util/utility-type";
import { ID } from "../value-object/id";

export class User implements Entity<ID> {
  private _id: ID;
  private _name: string;
  private _email: Email;
  private _phone: Phone;

  constructor({
    id,
    name,
    email,
    phone,
  }: { id: ID; name: string; email: Email; phone: Phone }) {
    if (!id) {
      throw new Error("ID is required");
    }
    if (!name) {
      throw new Error("Name is required");
    }
    if (!email) {
      throw new Error("email is required");
    }
    if (!phone) {
      throw new Error("phone is required");
    }

    if (name.length > 20) {
      throw new Error("Name's length must be 20 or less");
    }

    this._id = id;
    this._name = name;
    this._email = email;
    this._phone = phone;
  }

  public static new({
    name,
    email,
    phone,
  }: { name: string; email: Email; phone: Phone }) {
    return new User({ id: ID.generate(), name, email, phone });
  }

  identity(): ID {
    return this._id;
  }
  equal(other: Entity<ID>): boolean {
    return this._id.equals(other.identity());
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }
  get phone(): Phone {
    return this._phone;
  }
}
