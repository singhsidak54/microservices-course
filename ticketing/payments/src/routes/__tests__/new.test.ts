import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../model/orders';
import { Payment } from '../../model/payment';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

it('returns a 404 when purchasing an order which does not exist', async () => {
    await request(app)
            .post('/api/payments')
            .set('Cookie', global.signin())
            .send({
                token: 'asdf',
                orderId: new mongoose.Types.ObjectId().toHexString()
            })
            .expect(404);
});

it('returns a 401 when purchasing an order which does not belong to the user', async () => {

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        price: 20
    });

    await order.save();

    await request(app)
            .post('/api/payments')
            .set('Cookie', global.signin())
            .send({
                token: 'asdf',
                orderId: order.id
            })
            .expect(401);

});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const user = global.signin(userId);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        status: OrderStatus.Cancelled,
        price: 20
    });

    await order.save();

    await request(app)
            .post('/api/payments')
            .set('Cookie', user)
            .send({
                token: 'asdf',
                orderId: order.id
            })
            .expect(400);
});

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const user = global.signin(userId);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        status: OrderStatus.Created,
        price: 20
    });

    await order.save();

    await request(app)
            .post('/api/payments')
            .set('Cookie', user)
            .send({
                token: 'tok_visa',
                orderId: order.id
            })
            .expect(201);
    
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual('inr');

    const fetchedPayment = await Payment.findOne({ chargeId: 'test-charge' });
    expect(fetchedPayment).not.toBeNull();
    expect(fetchedPayment!.orderId).toEqual(order.id);
});