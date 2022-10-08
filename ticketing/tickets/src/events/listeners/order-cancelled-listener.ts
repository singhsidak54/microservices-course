import { Listener, OrderCancelledEvent, Subjects } from "@sdstickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // fetch the ticket corresponding to the order
        const ticket = await Ticket.findById(data.ticket.id);
        // if no ticket, throw error
        if(!ticket) {
            throw new Error('Ticket not found.')
        }

        // unlock ticket
        ticket.set({ orderId: undefined });

        // save the ticket
        await ticket.save();

        // emit ticket updated event.
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        });

        // ack the message
        msg.ack();
    }
}