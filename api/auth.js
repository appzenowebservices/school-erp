import axios from 'axios';
import httpClient from '../services/httpClient';
//========================================================================
const API_URL = 'https://api.infoeight.com';

export const getUserFromUserName = async (phoneNumber) => {

  return axios.post(`${API_URL}/api`, {
    "api": "userAccount.getUserFromUserName",
    "user_name": phoneNumber,
    "platform": "WEB"
  });
};



//========================================================================================================

export const userAccountLogin = async ({ password, id }) => {

  return axios.post(`${API_URL}/api`, {
    "api": "userAccount.login",
    id,
    "user_password": password,
    "platform": "WEB",
    "token": ""
  });
};



//========================================================================================================



