import api from './api';
import { getCredentials, getId } from '../_helpers';

const login = async (email, pwd) => {
  const credentials = btoa(email + ':' + pwd);
  const resp = await api.get(`users/authenticate`, {
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  });

  if (resp.status === 200) {
    sessionStorage.setItem('sensevone.user', JSON.stringify(resp.data));
  }

  return resp;
}

const logout = () => {
  // Remove from local storage
  sessionStorage.removeItem('sensevone.user');
}

const update = async (user) => {
  const tag = user._etag;
  // Python eve server complains about these fields. Why?
  delete user._etag;
  delete user._updated;
  delete user._created;
  delete user._status;

  const config = { ...getCredentials() }
  config.headers['If-Match'] = tag;

  return api.patch(`users/${user._id}`, user, config);
}

const listUsers = async () => {
  const url = 'users/?where=' + encodeURIComponent(`{"_id":{"$ne": "${getId()}"},"role":{"$ne":"engineer"}}`)
  return api.get(url, getCredentials());
}

const listLastUsers = async (n) => {
  const url = `users/?sort=` + encodeURIComponent('[("last_login",-1)]') + `&max_result=${n}` + 
      '&where=' + encodeURIComponent(`{"_id":{"$ne": "${getId()}"},"role":{"$ne":"engineer"}}`);
  return api.get(url, getCredentials());
}

const createUser = async(user) => {
  return api.post(`users/`, user, getCredentials());
}

const getUserDetails = async (id) => {
  return api.get(`users/${id}`, getCredentials());
}

const deleteUser = async (user) => {
  const config = {...getCredentials()}
  config.headers['If-Match'] = user._etag;
  const uri = `users/${user._id}`
  return api.delete(uri, config);
}

export const userService = {
  login,
  logout,
  update,
  listUsers,
  listLastUsers,
  createUser,
  getUserDetails,
  deleteUser
}