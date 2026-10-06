import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================

export const getSiblingsList = async (
  profileId,
  sessionId,
  selectedClassId
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "client.getSiblings",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    id: sessionId,
    platform: "web",
    class_ids: selectedClassId


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
