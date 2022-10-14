import { Publisher, Subjects, PaymentCreatedEvent } from "@sdstickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}