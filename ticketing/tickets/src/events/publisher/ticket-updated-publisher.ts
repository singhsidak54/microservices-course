import { Publisher, Subjects, TicketUpdatedEvent } from "@sdstickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}