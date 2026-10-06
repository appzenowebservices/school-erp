import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
//========================================================================
const API_URL = API_BASE_URL;

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



