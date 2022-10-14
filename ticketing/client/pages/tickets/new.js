import { useState } from "react";
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

export default function newTicket() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: { title, price },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = (async event => {
        event.preventDefault()
        await doRequest();
    });

    const onBlur = () => {
        const value = parseFloat(price)
        if (isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    };

    return (
        <div>
            <h1>Create a ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="mb-3 form-group">
                    <label htmlFor="inputTitle" className="form-label">Title</label>
                    <input type="text" className="form-control" id="inputTitle" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3 form-group">
                    <label htmlFor="inputPrice" className="form-label">Price</label>
                    <input type="text" onBlur={onBlur} className="form-control" id="inputPrice" value={price} onChange={e => setPrice(e.target.value)} />
                </div>

                {errors}

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}