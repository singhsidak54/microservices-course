import { randomBytes } from "crypto";
import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
    url: "https://localhost:4222",
});

stan.on("connect", () => {
    console.log("Publisher connected to NATS.");

    const data = JSON.stringify({
        id: "123",
        title: "concert",
        price: 20,
    });

    stan.publish("ticket:created", data, () => {
        console.log("Event Published");
    });
});
