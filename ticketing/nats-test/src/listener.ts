import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
    url: "https://localhost:4222",
});

stan.on("connect", () => {
    console.log("Listener connected to NATS.");

    const options = stan.subscriptionOptions().setManualAckMode(true);
    const subscription = stan.subscribe(
        "ticket:created",
        "orders-service-queue-group",
        options
    );

    subscription.on("message", (msg: Message) => {
        const data = msg.getData();
        if (typeof data === "string") {
            console.log(
                `Received event #${msg.getSequence()}, with data ${JSON.parse(
                    data
                )}`
            );
        }
        msg.ack();
    });
});
