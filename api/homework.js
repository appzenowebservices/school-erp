import axios from "axios";
import { API_BASE_URL } from "../config/server";

// Thin reads for the Learning surfaces (homework). Read-only.
export async function getHomeworkList(profile, session, cookyGuid, cookyId, extra = {}) {
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      api: "homeworkReminder.getList",
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
    throw new Error(error.response?.data?.message || "Failed to fetch homework. Please try again.");
  }
}
