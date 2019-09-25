import axios from 'axios'

let uri = `${window.location.hostname}`
if (process.env.REACT_APP_REMOTE) {
  uri = process.env.REACT_APP_REMOTE;
}
let protocol = window.location.protocol;


const api = axios.create({
  baseURL: `${protocol}//${uri}/api/`,
  timeout: 60000,
  config: {
    headers: {
      'Accept': '*/*',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Content-Type': 'application/json'
    }
  }
});

export default api;