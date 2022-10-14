import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

export default function signIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password },
        onSuccess: () =>  Router.push('/')
    });

    const onSubmit = (async event => {
        event.preventDefault()
        await doRequest();
    });

    return (
        <div>
            <form onSubmit={onSubmit}>
                <h1>Sing In</h1>
                <div className="mb-3">
                    <label htmlFor="inputEmail" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="inputEmail" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword" className="form-label">Password</label>
                    <input type="password" className="form-control" id="inputPassword" value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                {errors}

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}