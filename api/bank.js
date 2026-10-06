import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================
export const getBankList = async (
  profileId,
  sessionId,
  payload
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "bank.getList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web"


  };

  if (payload?.name && payload.name.trim() !== "") {
    requestBody.name = payload.name;
  }

  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================