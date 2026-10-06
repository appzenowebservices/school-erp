import axios from "axios";
import { API_BASE_URL } from "../config/server";

// Thin reads for the Learning surfaces (real library data, not mocks). Read-only.
async function rpc(api, profile, session, cookyGuid, cookyId, extra = {}) {
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      api,
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
    throw new Error(error.response?.data?.message || `Failed to fetch ${api}. Please try again.`);
  }
}

export const getLibraryList = (p, s, g, c, e) => rpc("library.getList", p, s, g, c, e);
export const getBookList = (p, s, g, c, e) => rpc("book.getList", p, s, g, c, e);
export const getBorrowerList = (p, s, g, c, e) => rpc("borrower.getList", p, s, g, c, e);
export const getBookIssueList = (p, s, g, c, e) => rpc("bookIssue.getList", p, s, g, c, e);
export const getDigitalContent = (p, s, g, c, e) => rpc("student.getDigitalContent", p, s, g, c, e);
