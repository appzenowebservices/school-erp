import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================
export const getDepartments = async (
  profileId,
  sessionId,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "department.getList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",


  };

  // Only include "type" if feeType has a real value
  if (payload?.name && payload.name.trim() !== "") {
    requestBody.name = payload.name;
  }
   if (payload?.code && payload.code.trim() !== "") {
    requestBody.code = payload.code;
  }
   if (payload?.product_id && payload.product_id.trim() !== "") {
    requestBody.product_id = payload.product_id;
  }
  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
export const addDepartments = async (
  profileId,
  sessionId,
  payload

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  const requestBody = {
    "api": "department.add",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,

    name: payload?.name,
    description: payload?.description,
    product_ids: payload?.productId,
    "platform": "web"



  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================

export const editDepartments = async (
  profileId,
  sessionId,
  payload

) => {
  console.log('payload====_)', payload);

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "department.edit",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    id: payload?.id,

    name: payload?.name,
    description: payload?.description,
    product_ids: payload?.product_ids,
    products: payload?.products,
    "platform": "web"



  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================

export const deleteDepartments = async (
  profileId,
  sessionId,
  id

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "department.delete",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    id,

  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
