import axios from 'axios';
import httpClient from '../services/httpClient';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';


//========================================================================================================

export const getRecentBirthdayList = async (
  profileId,
  sessionId,
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "client.getRecentBirthdayList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",
    id: sessionId,


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
export const getMonthWiseBirthdayList = async (
  profileId,
  sessionId,

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "client.getMonthWiseBirthdayList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",
    id: sessionId,


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================

export const sendBirthdayWishes = async (
  profileId,
  sessionId,
  selectedStudent,
  selectedUserId

) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  const requestBody = {
    "api": "client.getMonthWiseBirthdayList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    "version_code": "1.2.4",
    id: sessionId,

    "student_ids": selectedStudent
    ,
    "user_ids": selectedUserId


  };


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};
//========================================================================================================
