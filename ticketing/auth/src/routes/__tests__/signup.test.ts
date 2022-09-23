import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@tescom',
                password: 'password'
            })
            .expect(400);
});

it('returns a 400 with an password less than 4 chars', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'pas'
            })
            .expect(400);
});

it('returns a 400 with an password greater than 20 chars', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'passsssssssssssssssss'
            })
            .expect(400);
});

it('returns a 400 with missing email and password', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({})
            .expect(400);
});

it('returns a 400 with missing email or password', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({ email: "test@test.com" })
            .expect(400);

    await request(app)
            .post('/api/users/signup')
            .send({ password: "password" })
            .expect(400);
});

it('disallows duplicate email', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(201);

    await request(app)
            .post('/api/users/signup')
            .send({
                email: "test@test.com",
                password: "password"
            })
            .expect(400);
});

it('sets a cookie on successful signup', async () => {
    const response = await request(app)
                            .post('/api/users/signup')
                            .send({
                                email: 'test@test.com',
                                password: 'password'
                            })
                            .expect(201);
    
    expect(response.get('Set-Cookie')).toBeDefined();
});