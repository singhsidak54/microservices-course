import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => string[];
}

let mongo: MongoMemoryServer
beforeAll(async () => {
    process.env.JWT_TOKEN = 'asdf';
    
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
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

global.signin = () => {
    const payload = {
        email: 'test@test.com',
        id: new mongoose.Types.ObjectId().toHexString()
    }

    const token = jwt.sign(payload, process.env.JWT_TOKEN!);
    const session = { jwt: token};
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');
    
    return [`session=${base64}`];
}