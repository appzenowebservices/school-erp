
import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from 'cookies-next';

// ==================================================================================================
export async function getExamList(selectedStandard, profile, session,) {

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");




  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      api: 'exam.getList',
      standard_id: selectedStandard,
      pagination: false,
      guid: resolvedGuid,
      logged_in_user_account_id: resolvedUserId,
      user_account_id: profile,
      client_id: session,
      platform: 'web',
      version_code: '1.1.1.17'
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================

// ==================================================================================================
export async function addExam(profileId, session) {

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");




  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, {
      "api": "exam.add",
      "guid": resolvedGuid,
      "logged_in_user_account_id": resolvedUserId,
      "user_account_id": profileId,
      "client_id": session,
      "platform": "web",
      // "standard_ids": [
      //   "7430"
      // ],
      // "name": "Test Exam 1",
      // "code": "TS1",
      // "serial_number": "1",
      // "max_marks": "25",
      // "pass_marks": "9",
      // "no_of_working_days": "60",
      // "is_displayable": "1",
      // "is_displayable_on_report_card_header": "1",
      // "weightage_percentage": "5",
      // "pattern": "MARKS",
      // "marks_entry_format": "SOFT COPY",
      // "report_card_format_id": "3905",
      // "start_date": "2021-01-10",
      // "end_date": "2021-01-12",
      // "marks_submission_deadline_date": "2021-01-16 02:22",
      // "delivery_date": "2021-01-21",
      // "ptm_date": "2021-01-21",
      // "report_card_publish_date": "Fri Jan 22 2021",
      // "report_card_publish_time": "16:00",
      // "is_parent_subjects_accept_average": "1",
      // "is_qr_code_required_in_report_card": "1",
      // "is_applicable_for_delivery": "1",
      // "block_report_card": "0",
      // "block_analysis": "0",
      // "is_schedule_published": "1",
      // "report_card_publish_datetime": "2021-01-22 16:00"
    });

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}