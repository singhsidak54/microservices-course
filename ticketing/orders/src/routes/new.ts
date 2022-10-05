import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sdstickets/common';
import { Ticket } from '../models/tickets';
import { Order } from '../models/orders';

const router = express.Router();
const EXPIRATION_WINDOW_MINUTES = 15;

router.post(
    '/api/orders',
    requireAuth,
    body('ticketId')
        .notEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) 
        .withMessage('Ticket ID must be provided.'),
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        // Find the ticket user is trying to order in the database
        const ticket = await Ticket.findById(ticketId);
        if(!ticket) {
            throw new NotFoundError();
        }
        
        // Make sure that the ticket isn't reserved
        const isReserved =  await ticket.isReserved();

        if(isReserved) {
            throw new BadRequestError("Ticket is already reserved.");
        }

        // Calculate expiration date for the order
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + EXPIRATION_WINDOW_MINUTES);

        // Build the order and save it to the database.
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket 
        })
        await order.save();

        // Publish an event saying that an order was created.
        
        res.status(201).send(order);
    }
);

export { router as newOrderRouter }