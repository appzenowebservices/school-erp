import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================
export const getTitle = async (
  profileId,
  sessionId,
  payload
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "userTitle.getList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",


  };

  if (payload?.name && payload.name.trim() !== "") {
    requestBody.name = payload.name;
  }

  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================


export const addTitle = async (
  profileId,
  sessionId,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "userTitle.add",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",
    name: payload?.name


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================


export const editTitle = async (
  profileId,
  sessionId,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "userTitle.edit",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",
    id: payload?.id,
    name: payload?.name


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};

//========================================================================================================

export const deleteTitle = async (
  profileId,
  sessionId,
  id

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "userTitle.delete",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",
    id


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
