import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';


//========================================================================================================

export const getProfiles = async ({ id, guid }) => {

  let userId = id !== null && id !== undefined ? id : localStorage.getItem('id');
  let guid_ = guid !== null && guid !== undefined ? guid : localStorage.getItem('guid');
  return axios.post(`${API_BASE_URL}/api`, {
    "api": "userAccount.getProfiles",
    id: userId,
    "logged_in_user_account_id": userId,
    "platform": "web",
    "guid": guid_
  });
};



