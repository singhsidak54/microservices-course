import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: (id?: string) => string[];
}

jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer
beforeAll(async () => {
    process.env.JWT_TOKEN = 'asdf';
    
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    
    for(let collection of collections) {
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    if(mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
})

global.signin = (id?: string) => {
    const payload = {
        email: 'test@test.com',
        id: id || new mongoose.Types.ObjectId().toHexString()
    }

    const token = jwt.sign(payload, process.env.JWT_TOKEN!);
    const session = { jwt: token};
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');
    
    return [`session=${base64}`];
}