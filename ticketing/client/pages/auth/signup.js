import { useState } from "react";
import axios from "axios";
import useRequest from "../../hooks/use-request";

export default function signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: { email, password }
    });

    const onSubmit = (async event => {
        event.preventDefault()

        doRequest();
    });

    return (
        <div className="container">
            <form onSubmit={onSubmit}>
                <h1>Sing Up</h1>
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