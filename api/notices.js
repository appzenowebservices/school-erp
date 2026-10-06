import axios from "axios";
import { API_BASE_URL } from "../config/server";

// Thin reads for the Learning surfaces (notices / circulars). Read-only.
export async function getNoticeList(profile, session, cookyGuid, cookyId, extra = {}) {
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      api: "notice.getList",
      guid: cookyGuid,
      logged_in_user_account_id: cookyId,
      user_account_id: profile,
      client_id: session,
      platform: "web",
      pagination: true,
      page: 1,
      limit: 50,
      ...extra,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch notices. Please try again.");
  }
}

export async function getNoticeTypes(profile, session, cookyGuid, cookyId) {
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      api: "noticeType.getList",
      guid: cookyGuid,
      logged_in_user_account_id: cookyId,
      user_account_id: profile,
      client_id: session,
      platform: "web",
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch notice types. Please try again.");
  }
}
