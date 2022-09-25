import axios from "axios";


export default function buildClient({ req }) {
    if(typeof window === 'undefined') {
        return axios.create({
            baseURL: 'http://ingress-srv-local',
            headers: req.headers
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
}