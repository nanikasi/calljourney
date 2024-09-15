import type { Entity } from "../../util/utility-type";
import { ID } from "../value-object/id";

export class Reservation implements Entity<ID> {
  private _id: ID;
  private _userID: ID;
  private _time: Date;
  private _customerCount: number;

  constructor({
    id,
    userID,
    time,
    customerCount
  }: { id: ID; userID: ID; time: Date; customerCount: number }) {
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
  }

  public static new({ userID, time, customerCount }: { userID: ID; time: Date; customerCount: number }) {
    return new Reservation({ id: ID.generate(), userID, time, customerCount });
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
}
