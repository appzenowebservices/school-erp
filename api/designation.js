import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================
export const getSchoolDesignation = async (
  profileId,
  sessionId,
  page,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "schoolDesignation.getList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",
    page: page,
    limit: 20


  };

  console.log('payload___', payload);


  if (payload?.name && payload.name.trim() !== "") {
    requestBody.name = payload.name;
  }
  if (payload?.role_id) {
    requestBody.role = payload.role_id;
  }
  if (payload?.department_id) {
    requestBody.department = payload.department_id;
  }
  if (payload?.has_login_access) {
    requestBody.allow_login_access = payload.has_login_access ? "1" : "0";
  }

  return axios.post(`${API_BASE_URL}/api`, requestBody);


};

//========================================================================================================
export const addSchoolDesignation = async (
  profileId,
  sessionId,
  payload

) => {
  console.log('payload======', payload);

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "schoolDesignation.add",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    name: payload?.name,
    school_role_id: payload?.role_id,
    is_allowed_for_admin_access: payload?.adminAccess ? "1" : "0",
    is_login_allowed: payload?.loginAccess ? "1" : "0",
    department_ids: payload?.department_ids,
    platform: "web",
    "version_code": "1.2.4",


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};

//========================================================================================================
export const editSchoolDesignation = async (
  profileId,
  sessionId,
  payload

) => {
  console.log('payload', payload);

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "schoolDesignation.edit",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    id: payload?.id,
    name: payload?.name,
    school_role_id: payload?.role_id,
    is_allowed_for_admin_access: payload?.is_allowed_for_admin_access,
    is_login_allowed: payload?.is_login_allowed,
    department_ids: payload?.department_ids,
    platform: "web",
    "version_code": "1.2.4",


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
export const deleteSchoolDesignation = async (
  profileId,
  sessionId,
  id

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "schoolDesignation.delete",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    id,

    platform: "web",
    "version_code": "1.2.4",


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
export const getDesignationPermissions = async (
  profileId,
  sessionId,

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "client.getPermissions",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    id: sessionId,
    platform: "web"

  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
