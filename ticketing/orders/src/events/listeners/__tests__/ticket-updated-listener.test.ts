import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@sdstickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    })
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'new concert',
        price: 999,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
};

it('finds, updates and saves a ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);
    
    const fetchedTicket = await Ticket.findById(ticket.id);

    expect(fetchedTicket!.title).toEqual(data.title);
    expect(fetchedTicket!.price).toEqual(data.price);
    expect(fetchedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    
    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event is out of order', async () => {
    const { listener, ticket, data, msg } = await setup();
    data.version = 10;

    await expect(listener.onMessage(data, msg)).rejects.toThrow('Ticket not found.');
    
    expect(msg.ack).not.toHaveBeenCalled();
});