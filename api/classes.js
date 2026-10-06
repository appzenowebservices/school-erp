import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from "cookies-next";

//========================================================================================================
export async function getClassesList(profileId, sessionId, guid, id) {
  //========================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  console.log(profileId, sessionId, guid, id);

  //========================================================================================================
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "classRoom.getList",
      "guid": guid,
      "logged_in_user_account_id": id,
      "user_account_id": profileId,
      "client_id": sessionId,
      "platform": "web"
    });
    // console.log(' response.data;:',  response);

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
//========================================================================================================
export async function addClass(profileId, sessionId, standardId, selectedTeacher, section) {
  //========================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");
  console.log('resolvedGuid ---:', profileId, sessionId, standardId, selectedTeacher, section);
  //========================================================================================================
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "classRoom.add",
      "guid": resolvedGuid,
      "logged_in_user_account_id": resolvedUserId,
      "user_account_id": profileId,
      "client_id": sessionId,
      "platform": "web",



      "standard_id": standardId,
      "section": section,
      "is_displayable": "1",
      "teacher_id": selectedTeacher



    });
    // console.log(' response.data;:',  response);

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
//========================================================================================================



export async function editClass(profileId, sessionId, standardId, selectedTeacher, section, selectedClass) {
  //========================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");
  console.log('resolvedGuid ---:', profileId, sessionId, standardId, selectedTeacher, section, selectedClass);
  //========================================================================================================
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "classRoom.edit",
      "guid": resolvedGuid,
      "logged_in_user_account_id": resolvedUserId,
      "user_account_id": profileId,
      "client_id": sessionId,
      "platform": "web",







      "id": selectedClass,
      // "standard_id": standardId,

      "section": section,
      "is_displayable": "1",
      "teacher_id": selectedTeacher



    });
    // console.log(' response.data;:',  response);

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
//========================================================================================================



export async function arrangeRollNosApi(profileId, sessionId, classId) {
  //========================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");
  //========================================================================================================
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "classRoom.arrangeRollNos",
      "guid": resolvedGuid,
      "logged_in_user_account_id": resolvedUserId,
      "user_account_id": profileId,
      "client_id": sessionId,
      "platform": "web",
      "id": classId
    });
    
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
//========================================================================================================
export async function removeAllStudentApi(profileId, sessionId, classId) {
  //========================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");
  //========================================================================================================
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "classRoom.removeAllStudents",
      "guid": resolvedGuid,
      "logged_in_user_account_id": resolvedUserId,
      "user_account_id": profileId,
      "client_id": sessionId,
      "platform": "web",
      "id": classId
    });
    
    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
//========================================================================================================