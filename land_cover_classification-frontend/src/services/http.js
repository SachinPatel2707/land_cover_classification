import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/'

const make_get_call = () => {

}

const make_post_call = (api, data) => {
    const url = BASE_URL + api;
    return new Promise((resolve, reject) => {
        axios.post(url, data)
          .then(response => {
            resolve(response.data);
          })
          .catch(error => {
            reject(error);
          });
    });
}

export default {
    make_get_call,
    make_post_call
}

