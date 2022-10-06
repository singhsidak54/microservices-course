import { Publisher, OrderCreatedEvent, Subjects, OrderCancelledEvent } from "@sdstickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}