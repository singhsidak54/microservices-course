import { OrderCancelledEvent, OrderStatus } from "@sdstickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../model/orders";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // create instance of listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    // create and save an order
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: 'asdf',
        status: OrderStatus.Created,
        price: 100
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'asdf',
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it('sets orderstatus as cancelled', async () => {
    const { listener, data, msg } = await setup();
    
    await listener.onMessage(data, msg);

    const fetchedOrder = await Order.findById(data.id);

    expect(fetchedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})