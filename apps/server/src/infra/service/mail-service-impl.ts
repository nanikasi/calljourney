import type { Reservation } from "../../domain/model/reservation";
import type { User } from "../../domain/model/user";
import type { MailService } from "../../service/mail-service";

export class MailServiceImpl implements MailService {
  private _apiKey: string;
  private _sederEmail: string;

  constructor(apiKey: string, senderEmail: string) {
    this._apiKey = apiKey;
    this._sederEmail = senderEmail;
  }

  private async send(
    user: User,
    subject: string,
    content: string,
  ): Promise<void> {
    const response = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this._apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: {
          email: this._sederEmail,
          name: "CallJourney",
        },
        to: [
          {
            email: user.email.full,
            name: user.name,
          },
        ],
        subject: subject,
        text: content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.status}`);
    }
  }

  async sendSuccess(user: User, reservation: Reservation): Promise<void> {
    const subject = "calljourney / 予約完了のお知らせ";
    const textContent = `
      ${user.name}様

予約が確定しました。
店舗電話番号: ${reservation.phone.local}
日時: ${reservation.time.tz("Asia/Tokyo").format("MM月DD日 HH時mm分")}
予約人数: ${reservation.customerCount}

当日は遅れないようにお気をつけてお店にお越しください。

利用後アンケートにご協力ください。
https://docs.google.com/forms/d/e/1FAIpQLSdwsZqF74Ll63fFMvU0SQtOkDUoG1h-y83wplw5AOl0KNBwpw/viewform?entry.327336390=${user.identity().value()}

CallJourney
    `;

    return await this.send(user, subject, textContent);
  }

  async sendFail(user: User, reservation: Reservation): Promise<void> {
    const subject = "CallJourney / 予約に関して";
    const textContent = `
      ${user.name}様

予約することができませんでした。
お手数ですが、日時を変更して再度お電話お願いします。

店舗電話番号: ${reservation.phone.local}
日時: ${reservation.time.tz("Asia/Tokyo").format("MM月DD日 HH時mm分")}
予約人数: ${reservation.customerCount}

利用後アンケートにご協力ください。
https://docs.google.com/forms/d/e/1FAIpQLSeZ0UKQLeWaELi-lEFlvjqGZRuMyZMHXIjjXjIVZUD_A1IqKA/viewform?entry.327336390=${user.identity().value()}
      
CallJourney
    `;

    return await this.send(user, subject, textContent);
  }
}
