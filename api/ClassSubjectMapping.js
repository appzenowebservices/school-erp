import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================
export const getClassSubjectMapping = async (
  profileId,
  sessionId,

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "client.getClassSubjectMapping",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    id: sessionId,
    platform: "web",
    "version_code": "1.2.4",


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
