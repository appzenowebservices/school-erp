
import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from "cookies-next";

// ==================================================================================================
export async function getSubjectsList(selectedStandard, profile, session) {
  // console.log(selectedStandard, cookyGuid, profile, session, cookyId);

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "subject.getList",
      "standard_id": selectedStandard,
      "pagination": false,
      "guid": resolvedGuid,
      "logged_in_user_account_id":resolvedUserId ,
      "user_account_id": profile,
      "client_id": session,
      "platform": "WEB",
      "version_code": "1.1.1.17"
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================