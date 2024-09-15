import type { Entity } from "../../util/utility-type";
import { ID } from "../value-object/id";
import type { Phone } from "../value-object/phone";
import type { Status } from "../value-object/reservation-status";

export class Reservation implements Entity<ID> {
  private _id: ID;
  private _userID: ID;
  private _phone: Phone;
  private _time: Date;
  private _customerCount: number;
  private _status: Status;

  constructor({
    id,
    userID,
    phone,
    time,
    customerCount,
    status,
  }: {
    id: ID;
    userID: ID;
    phone: Phone;
    time: Date;
    customerCount: number;
    status: Status;
  }) {
    if (!id) {
      throw new Error("ID is required");
    }
    if (!userID) {
      throw new Error("userID is required");
    }
    if (!phone) {
      throw new Error("Phone is required");
    }
    if (!time) {
      throw new Error("time is required");
    }
    if (!customerCount) {
      throw new Error("customerCount is required");
    }

    if (customerCount <= 0) {
      throw new Error("customerCount must be more than 0");
    }

    this._id = id;
    this._userID = userID;
    this._phone = phone;
    this._time = time;
    this._customerCount = customerCount;
    this._status = status;
  }

  public static new({
    userID,
    phone,
    time,
    customerCount,
  }: { userID: ID; phone: Phone; time: Date; customerCount: number }) {
    return new Reservation({
      id: ID.generate(),
      userID,
      phone,
      time,
      customerCount,
      status: "pending",
    });
  }

  identity(): ID {
    return this._id;
  }
  equal(other: Entity<ID>): boolean {
    return this._id.equals(other.identity());
  }

  get userID(): ID {
    return this._userID;
  }
  get phone(): Phone {
    return this._phone;
  }
  get time(): Date {
    return this._time;
  }
  get customerCount(): number {
    return this._customerCount;
  }
  get status(): string {
    return this._status;
  }

  public success(): Reservation {
    if (this._status !== "pending") {
      throw new Error("status must be pending");
    }

    this._status = "success";

    return this;
  }

  public fail(): Reservation {
    if (this._status !== "pending") {
      throw new Error("status must be pending");
    }

    this._status = "fail";

    return this;
  }
}
