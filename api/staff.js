import axios from 'axios';
import { getCookie } from 'cookies-next';
import { API_BASE_URL } from '../config/server';



//========================================================================================================

export const getStaffApi = async ({
  profileId,
  sessionId,

  params,
  page,
  limit

}) => {


  console.log('======= page : ', page);
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {
    "api": "user.getList",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    ...params,
    page,
    limit: 20,

  });
};

// ==================================================================================================




export async function getStaffDetails(profile, session, cookyGuid, cookyId, studentId) {
  console.log(profile, session, cookyGuid, cookyId, studentId);

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

      "api": "user.getDetails",
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



//========================================================================================================

export const addStaff = async (
  profile,
  session,
  cookyGuid,
  cookyId,

  payload
) => {





  return axios.post(`${API_BASE_URL}/api`, {
    "api": "user.add",
    "guid": cookyGuid,
    "logged_in_user_account_id": cookyId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "web",

    "name": payload?.name,
    "user_title_id": payload?.title,
    "gender": payload?.gender,
    "school_designation_id": payload?.designation,
    "class_id": payload?.class,

    "date_of_birth": payload?.dateOfBirth,
    "joining_date": payload?.joiningDate,
    "is_enabled_for_invoice_notification": payload?.invoiceNotificationEnabled ? "1" : "0",
    "class_coordinator_standard": payload?.classCoordinator ? "1" : "0",
    "category": payload?.category,
    "blood_group": payload?.bloodGroup,

    emails: [...(payload?.emails || []), payload?.email].filter(Boolean),
    phones: [...new Set([...(payload?.phones || []), payload?.phone].filter(Boolean))],
    "emergency_contact_number": payload?.emergencyPhone,
    "father_name": payload?.fatherName,
    "mother_name": payload?.motherName,
    "name_of_son": payload?.sonName,
    "name_of_daughter": payload?.daughterName,
    "spouse_name": payload?.spouseName,
    "permanent_address": payload?.permanentAddress,
    "address": payload?.currentAddress,

    "aadhaar_number": payload?.aadhaar,
    pan_number: payload?.pan,
    employee_id: payload?.employeeId,
    special_designation: payload?.specialDesignation,
    date_of_retirement: payload?.retirementDate,
    type_of_appointment: payload?.appointmentType,

    academic_qualification: payload?.academicQualification,
    professional_qualification: payload?.professionalQualification,
    experience: payload?.experience,
    year_of_passing: payload?.yearOfPassing,

    "bank_details": {

      bank_id: payload?.bank,
      account_holder_name: payload?.accountHolderName,
      account_number: payload?.accountNumber,
      ifsc_code: payload?.ifscCode,
      branch_name: payload?.branchName
    }

  });
};




//========================================================================================================
export async function patchStaffDetail(payload) {
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  let finalPayloadd = {
    "api": "user.edit",
    "platform": "web",
    ...payload,
  }
  console.log('finalPayloadd________', finalPayloadd);

  // ==================================================================================================

  try {
    const response = await axios.post(`${API_BASE_URL}/api`, finalPayloadd);

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}




//========================================================================================================
export async function uploadStaffSignature(payload) {
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  let finalPayloadd = {
    "api": "user.uploadSignature",
    logged_in_user_account_id: resolvedUserId,
    "guid": resolvedGuid,
    "platform": "web",
    ...payload,
  }
  // console.log('finalPayloadd', finalPayloadd);

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



//========================================================================================================
export async function removeFromClientApi(finalPayload) {
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  let finalPayloadd = {
    logged_in_user_account_id: resolvedUserId,
    guid: resolvedGuid,
    ...finalPayload

  }
  // console.log('finalPayloadd', finalPayloadd);

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


//========================================================================================================
export async function getPermittedClasses(profileId, sessionId, selectedStaff) {
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  let finalPayloadd = {

    "api": "user.getPermittedClasses",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",

    id: selectedStaff


  }
  // console.log('finalPayloadd', finalPayloadd);

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




//========================================================================================================
export async function editClassPermissionsApi(profileId, sessionId, selectedStaff, permittedClasses) {
  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  let finalPayloadd = {

    "api": "user.editClassPermissions",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",

    id: selectedStaff,
    class_ids: permittedClasses


  }
  // console.log('finalPayloadd', finalPayloadd);

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