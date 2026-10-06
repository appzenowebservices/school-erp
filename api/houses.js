
import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from 'cookies-next';

// ==================================================================================================
export async function getHouseList(profile, session,) {

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================
  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {

      "api": "house.getList",

      guid: resolvedGuid,
      logged_in_user_account_id: resolvedUserId,
      "user_account_id": profile,
      "client_id": session,
      "platform": "web"
      // "version_code": "1.1.2.18"
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================




export async function getHouseDetail(profile, session, cookyGuid, cookyId, studentId) {
  // console.log(profile, session, cookyGuid, cookyId);

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      // "api": "student.getList",
      // "perPage": "20",
      // "page": 1,
      // "guid": "1756111684.1421skt68ac234422afe1.14679239",
      // "logged_in_user_account_id": "885283",
      // "user_account_id": "558664",
      // "client_id": "2200",
      // "platform": "android"

      "api": "student.getDetails",
      // "perPage": "20",
      // "page": 1,
      "guid": cookyGuid,
      "logged_in_user_account_id": cookyId,
      "user_account_id": profile,
      "client_id": session,
      "platform": "android",
      "id": studentId
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================



// export async function patchStudentDetail(profile, session, cookyGuid, cookyId, studentId, name) {
export async function patchHouse(
  profileId,
  session,
  name,
  description,
  logo,
  houseId
) {
  // ==================================================================================================
  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  let finalPayloadd = {
    "api": "house.edit",
    "platform": "web",

    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "WEB",
    "name": name,
    "description": description,
    "logo_url": logo,
    "id": houseId



  }
  console.log('finalPayloadd', finalPayloadd);

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, finalPayloadd);

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================



//========================================================================================================

export const addHouse = async (
  profile,
  session,


  payload
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");
  console.log('payload___hosyue', payload);


  return axios.post(`${API_BASE_URL}/api`, {
    "api": "house.add",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "web",

    "name": payload?.name,
    "description": payload?.description,
    "logo_url": payload?.logo_url

  });
};


//========================================================================================================

export const deleteHouse = async (
  profile,
  session,


  houseId
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {
    "api": "house.delete",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "web",
    "id": houseId

  });
};
