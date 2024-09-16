import type { Reservation } from "../../domain/model/reservation";
import type { User } from "../../domain/model/user";
import type { CallService } from "../../service/call-service";

export class CallServiceImpl implements CallService {
  private _apiUrl: string;
  private _accountSID: string;
  private _authToken: string;
  private _twilioPhoneNumber: string;

  constructor(
    apiUrl: string,
    accountSID: string,
    authToken: string,
    twilioPhoneNumber: string,
  ) {
    this._apiUrl = apiUrl;
    this._accountSID = accountSID;
    this._authToken = authToken;
    this._twilioPhoneNumber = twilioPhoneNumber;
  }

  async call(user: User, reservation: Reservation): Promise<void> {
    const url = this._apiUrl;

    const time = reservation.time.tz("Asia/Tokyo");

    const params = new URLSearchParams();
    params.append("To", reservation.phone.international);
    params.append("From", this._twilioPhoneNumber);
    params.append(
      "Parameters",
      JSON.stringify({
        name: user.name,
        phone: user.phone,
        customerCount: reservation.customerCount,
        date: `${time.date()}日`,
        time: `${time.hour()}時${time.minute()}分`,
        reservationID: reservation.identity().value(),
      }),
    );

    const options = {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${this._accountSID}:${this._authToken}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to call API. Status: ${response.status}`);
    }
  }
}
