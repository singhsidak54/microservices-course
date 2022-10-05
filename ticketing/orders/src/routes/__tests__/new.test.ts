import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/tickets';
import { Order, OrderStatus } from '../../models/orders';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
            .post('/api/orders')
            .set('Cookie', global.signin())
            .send({ ticketId: ticketId })
            .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();
    
    const order = Order.build({
        ticket,
        userId: 'lasdasd',
        status: OrderStatus.Created,
        expiresAt: new Date()
    });
    await order.save();

    await request(app)
            .post('/api/orders')
            .set('Cookie', global.signin())
            .send({ ticketId: ticket.id })
            .expect(400);

});

it('reserves the ticket', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    await request(app)
            .post('/api/orders')
            .set('Cookie', global.signin())
            .send({ ticketId: ticket.id })
            .expect(201);
});