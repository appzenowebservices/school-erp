// utils/api/dashboard.js

import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from "cookies-next";


//========================================================================================================

export const getAttendanceList = async (
  profile,
  session,
  selectedDate,
  cookyGuid,
  selectedClassId,
  cookyId,) => {




  return axios.post(`${API_BASE_URL}/api`, {
    "api": "classRoom.getAttendance",
    "id": selectedClassId,
    "date": selectedDate,
    "guid": cookyGuid,
    "logged_in_user_account_id": cookyId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "WEB",
    "version_code": "1.1.1.17"
  });
};
//========================================================================================================
export const markAttendance = async (
  profile,
  session,
  selectedDate,
  selectedClassId,
  attendancePayload,
  hasAttendance
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");




  return axios.post(`${API_BASE_URL}/api`, {
    "api": "classRoom.markAttendance",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profile,
    client_id: session,
    "platform": "WEB",
    "id": selectedClassId,
    "date": selectedDate,
    "is_updated": hasAttendance,
    "attendance": attendancePayload
  });
};
//========================================================================================================

export const getAttendanceReportApi = async (
  profile,
  session,
  selectedDate,
  cookyGuid,
  selectedClassId,
  cookyId,) => {

  // console.log('here it comes sdsd-----------',
  //    profile,
  //   session,
  //   selectedDate,
  //   cookyGuid,
  //   selectedClassId,
  //   cookyId,);


  return axios.post(`${API_BASE_URL}/api`, {
    "api": "client.getDailyAttendanceReport",
    "id": session,
    "date": selectedDate, //yy-mm-dd

    "guid": cookyGuid,
    "logged_in_user_account_id": cookyId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "WEB",
  });
};