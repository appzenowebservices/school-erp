// utils/api/dashboard.js
import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from "cookies-next";

export async function getUserDashboardData(profileId, sessionId, guid, cookyId, ctx) {
  const API_BASE_URL_ = API_BASE_URL;

  let resolvedGuid = guid ?? getCookie("guid", ctx);
  let resolvedUserId = getCookie("id", ctx);

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      api: "client.getDashboard",
      guid: resolvedGuid,
      logged_in_user_account_id: resolvedUserId,
      user_account_id: profileId,
      client_id: sessionId,
      platform: "web",
      id: sessionId,
    });

    return response.data;
  } catch (error) {
    console.error("API call error:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard data.");
  }
}
