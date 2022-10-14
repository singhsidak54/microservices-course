import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sdstickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../model/orders';
import { Payment } from '../model/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';


const router = express.Router();

router.post(
    '/api/payments', 
    requireAuth,
    body('token').not().isEmpty().withMessage('Missing Token'),
    body('orderId').not().isEmpty().withMessage('Missing order id'),
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderId } = req.body;

        const order = await Order.findById(orderId);

        if(!order) {
            throw new NotFoundError();
        }

        if(order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        if(order.status === OrderStatus.Cancelled) {
            throw new BadRequestError('Cannot pay for an expired order.');
        }

        const charge = await stripe.charges.create({
                                currency: 'inr',
                                amount: order.price * 100,
                                source: token
                            });
        
        const payment = Payment.build({
            orderId,
            stripeId: charge.id
        });
        await payment.save();
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        });

        res.status(201).send({ id: payment.id });
    }
)

export { router as createChargeRouter };