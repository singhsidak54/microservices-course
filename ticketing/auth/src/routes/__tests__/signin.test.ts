import request from 'supertest';
import { app } from '../../app';

it('returns 400 with an invalid email', async () => {
    return request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@tescom',
                password: 'password'
            })
            .expect(400);
});

it('returns 400 when no password is supplied', async () => {
    return request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(400);
});

it('returns 400 when user doesnt exist', async () => {
    return request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(400);
});

it('returns 400 when wrong password is supplied', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201);
    
    await request(app)
            .post('/api/users/signin')
            .send({
                email: 'test@test.com',
                password: 'passsword'
            })
            .expect(400);
});

it('returns 200 when correct password is supplied and sets a cookie', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                email: 'test@test.com',
                password: 'password'
            })
            .expect(201);
    
    const response = await request(app)
                            .post('/api/users/signin')
                            .send({
                                email: 'test@test.com',
                                password: 'password'
                            })
                            .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});