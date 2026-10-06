import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================
export const getSchoolRoles = async (
  profileId,
  sessionId,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "schoolRole.getList",
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


  if (payload?.has_admin_access) {
    requestBody.has_admin_access = payload.has_admin_access;
  }

  if (payload?.is_teaching_staff) {
    requestBody.is_teaching_staff = payload.is_teaching_staff;
  }


  if (payload?.is_enabled) {
    requestBody.is_enabled = payload.is_enabled;
  }

  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================


export const addSchoolRoles = async (
  profileId,
  sessionId,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "schoolRole.add",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",
    name: payload?.name,
    is_teaching_staff: payload?.isTeachingStaff,
    is_bus_conductor: payload?.isBusConductor,
    description: payload?.description,


  };

  console.log('requestBody', requestBody);
  

  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================

export const editSchoolRoles = async (
  profileId,
  sessionId,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  console.log('-______', payload);

  const requestBody = {
    "api": "schoolRole.edit",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",
    id: payload?.id,
    name: payload?.name,
    is_teaching_staff: payload?.isTeachingStaff ? "1" : "0",
    is_bus_conductor: payload?.isBusConductor ? "1" : "0",
    description: payload?.description,


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================



export const deleteSchoolRoles = async (
  profileId,
  sessionId,
  id

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "schoolRole.delete",
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
