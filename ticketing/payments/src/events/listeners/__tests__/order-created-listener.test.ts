import { OrderCreatedEvent, OrderStatus } from "@sdstickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../model/orders";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async () => {
    // create instance of listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'acsd',
        expiresAt: 'asdf',
        ticket: {
            id: 'asdf',
            price: 999
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it('adds the order in order db', async () => {
    const { listener, data, msg } = await setup();
    
    await listener.onMessage(data, msg);

    const fetchedOrder = await Order.findById(data.id);

    expect(fetchedOrder!.id).toEqual(data.id);
    expect(fetchedOrder!.userId).toEqual(data.userId);
    expect(fetchedOrder!.price).toEqual(data.ticket.price);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})