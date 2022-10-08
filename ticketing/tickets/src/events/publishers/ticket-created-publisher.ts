import { Publisher, Subjects, TicketCreatedEvent } from "@sdstickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}