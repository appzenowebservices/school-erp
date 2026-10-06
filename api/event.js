import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================

export const getEvents = async (
  profileId,
  sessionId,
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");





  return axios.post(`${API_BASE_URL}/api`, {
    "api": "event.getList",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web"
  });
};




//========================================================================================================
export const getEventTypes = async (
  profileId,
  sessionId,
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");





  return axios.post(`${API_BASE_URL}/api`, {
    "api": "eventType.getList",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web"
  });
};



//========================================================================================================
export const updateEventType = async (
  profileId,
  sessionId,
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");





  return axios.post(`${API_BASE_URL}/api`, {
    "api": "eventType.edit",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web"
  });
};