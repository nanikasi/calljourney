import type { Entity } from "../../util/utility-type";
import { ID } from "../value-object/id";
import type { Status } from "../value-object/reservation-status";

export class Reservation implements Entity<ID> {
  private _id: ID;
  private _userID: ID;
  private _time: Date;
  private _customerCount: number;
  private _status: Status;

  constructor({
    id,
    userID,
    time,
    customerCount,
    status,
  }: {
    id: ID;
    userID: ID;
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
    this._time = time;
    this._customerCount = customerCount;
    this._status = status;
  }

  public static new({
    userID,
    time,
    customerCount,
  }: { userID: ID; time: Date; customerCount: number }) {
    return new Reservation({
      id: ID.generate(),
      userID,
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
