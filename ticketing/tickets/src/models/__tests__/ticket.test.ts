import { Ticket } from "../tickets";

it('implements optimistic concurrency control', async () => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })

    // Save the ticket to the db
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two separate chhanges to the tickets we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15});

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket
    await expect(secondInstance!.save()).rejects.toThrow();
});

it('increments the version number on multiple save', async () => {
    // Create an instance of a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    })

    // Save the ticket to the db
    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});