import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import type { Reservation } from "../../domain/model/reservation";
import type { User } from "../../domain/model/user";
import type { MailService } from "../../service/mail-service";

export class MailServiceImpl implements MailService {
  private mailerSend: MailerSend;
  private sentFrom: Sender;

  constructor(apiKey: string, senderEmail: string, senderName: string) {
    this.mailerSend = new MailerSend({ apiKey });
    this.sentFrom = new Sender(senderEmail, senderName);
  }

  private createEmailParams(
    user: User,
    subject: string,
    textContent: string,
  ): EmailParams {
    const recipients = [new Recipient(String(user.email), user.name)];

    return new EmailParams()
      .setFrom(this.sentFrom)
      .setTo(recipients)
      .setReplyTo(this.sentFrom)
      .setSubject(subject)
      .setText(textContent);
  }

  async sendSuccess(user: User, reservation: Reservation): Promise<void> {
    const subject = "calljourney / 予約完了のお知らせ";
    const textContent = `
      ${user.name}様

      予約が確定しました。
      店舗電話番号: ${reservation.time}
      日時: ${reservation.time} ${reservation.time}
      予約人数: ${reservation.customerCount}

      当日は遅れないようにお気をつけてお店にお越しください。

      CallJourney
    `;

    const emailParams = this.createEmailParams(user, subject, textContent);
    await this.mailerSend.email.send(emailParams);
  }

  async sendFail(user: User, reservation: Reservation): Promise<void> {
    const subject = "CallJourney / 予約に関して";
    const textContent = `
      ${user.name}様

      予約することができませんでした。
      お手数ですが、日時を変更して再度お電話お願いします。

      店舗電話番号: ${reservation.time}
      日時: ${reservation.time} ${reservation.time}
      予約人数: ${reservation.customerCount}
      
      CallJourney
    `;

    const emailParams = this.createEmailParams(user, subject, textContent);
    await this.mailerSend.email.send(emailParams);
  }
}
