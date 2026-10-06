import axios from 'axios';
import { API_BASE_URL } from '../config/server';


//========================================================================================================




export async function getHomeworkSubjects(profile, session, cookyGuid, cookyId, studentId) {

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {

      "api": "user.getHomeworkSubjects",
      "guid": "1756292485.7516skt68aee585b77d48.88276934",
      "logged_in_user_account_id": "885283",
      "user_account_id": "558664",
      "client_id": "2200",
      "platform": "android",
      "version_code": "1.1.2.18"

    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}

//========================================================================================================



export async function createOnlineClasses(profile, session, cookyGuid, cookyId, studentId) {

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {

      "api": "meeting.getList",
      "guid": cookyGuid,
      "logged_in_user_account_id": cookyId,
      "user_account_id": profile,
      "client_id": session,
      "platform": "web",

    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
