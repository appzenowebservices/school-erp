
import axios from "axios";
import { API_BASE_URL } from "../config/server";
import { getCookie } from "cookies-next";




// ==================================================================================================

export const getStudentList = async (
  profileId,
  sessionId,
  payload = {},
  page,
  limit,
) => {


  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");



  const requestBody = {
    api: "student.getList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    page,
    limit,
  };



  if (payload?.classId && payload.classId.trim() !== "") {
    requestBody.class_id = payload.classId;
  }

  if (payload?.name && payload.name.trim() !== "") {
    requestBody.name = payload.name;
  }

  if (payload?.status && payload.status.trim() !== "") {
    requestBody.status = payload.status;
  }
  if (payload?.appUsed && payload.appUsed.trim() !== "") {
    requestBody.app_user = payload.appUsed;
  }
  if (payload?.gender && payload.gender.trim() !== "") {
    requestBody.gender = payload.gender;
  }
  if (payload?.phone && payload.phone.trim() !== "") {
    requestBody.phone = payload.phone;
  }
  if (payload?.admission_number && payload.admission_number.trim() !== "") {
    requestBody.admission_number = payload.admission_number;
  }

  if (payload?.father_name && payload.father_name.trim() !== "") {
    requestBody.father_name = payload.father_name;
  }
  if (payload?.mother_name && payload.mother_name.trim() !== "") {
    requestBody.mother_name = payload.mother_name;
  }


  if (payload?.date_of_birth && payload.date_of_birth.trim() !== "") {
    requestBody.date_of_birth = payload.date_of_birth;
  }

  if (payload?.registration_number && payload.registration_number.trim() !== "") {
    requestBody.registration_number = payload.registration_number;
  }
  if (payload?.registered_phone_for_sms && payload.registered_phone_for_sms.trim() !== "") {
    requestBody.registered_phone_for_sms = payload.registered_phone_for_sms;
  }
  if (payload?.optional_subject && payload.optional_subject.trim() !== "") {
    requestBody.optional_subject = payload.optional_subject;
  }

  if (payload?.email && payload.email.trim() !== "") {
    requestBody.email = payload.email;
  }
  if (payload?.renewal_status && payload.renewal_status.trim() !== "") {
    requestBody.renewal_status = payload.renewal_status;
  }
  if (payload?.non_app_user) {
    requestBody.non_app_user = payload.non_app_user;
  }
  if (payload?.is_registered) {
    requestBody.is_registered = payload.is_registered;
  }
  if (payload?.with_out_any_phone_number) {
    requestBody.with_out_any_phone_number = payload.with_out_any_phone_number;
  }







  return axios.post(`${API_BASE_URL}/api`, requestBody);
};



// =================================================================================================








export async function getStudentDetail(profile, session, cookyGuid, cookyId, studentId) {
  // console.log(profile, session, cookyGuid, cookyId);

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

      "api": "student.getDetails",
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
// ==================================================================================================



// export async function patchStudentDetail(profile, session, cookyGuid, cookyId, studentId, name) {
export async function patchStudentDetail(payload) {

  let finalPayloadd = {
    "api": "student.edit",
    "platform": "web",

    ...payload,


  }
  console.log('finalPayloadd', payload);

  // ==================================================================================================
  const API_BASE_URL_ = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;
  // ==================================================================================================

  try {
    const response = await axios.post(`${API_BASE_URL_}/api`, finalPayloadd);
    // console.log('response', response);

    return response.data;
  } catch (error) {
    console.error('API call error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data. Please try again.');
  }
}
// ==================================================================================================



//========================================================================================================

export const addStudent = async (
  profile,
  session,
  cookyGuid,
  cookyId,

  payload
) => {
  console.log('====== payload ___________________ : ', payload?.documents)


  // console.log('=======--------------- payload : ', payload?.parents?.map((p) => ({
  //   relation_with_student: p.relation,
  //   name: p.name,
  //   gender: p.gender,
  //   phones: p.phones?.filter((ph) => ph && ph.trim() !== "") || [],
  //   emails: p.emails?.filter((em) => em && em.trim() !== "") || [],

  // })));
  
  return axios.post(`${API_BASE_URL}/api`, {
    "api": "student.add",
    "guid": cookyGuid,
    "logged_in_user_account_id": cookyId,
    "user_account_id": profile,
    "client_id": session,
    "platform": "web",


    "school_id": payload?.school,
    "name": payload?.name,
    "roll_number": payload?.rollNo,
    "class_id": payload?.class,

    "gender": payload?.gender,
    "house_id": payload?.house,


    "admission_number": payload?.admissionNumber,
    // "is_new": payload?.admissionNumber,
    // "fee_category": payload?.admissionNumber,
    "registration_number": payload?.registrationNumber,
    "aadhar_card_number": payload?.aadharCard,
    "emails": [
      payload?.email,
    ],
    "phones": [
      payload?.alternatePhone,
    ],
    "date_of_birth": payload?.dateOfBirth,
    "gender": payload?.gender,
    "house_id": payload?.house,
    // "student_fee_category_id": payload?.admissionNumber,
    "renewal_status": payload?.renewalStatus ? payload?.renewalStatus : "NEW",
    "nationality": payload?.nationality,
    "date_of_admission": payload?.date_of_admission,
    "category": payload?.category,
    "religion": payload?.religion,
    "mother_tongue": payload?.motherTongue,
    "address": payload?.address,
    "locality": payload?.locality,
    "landmark": payload?.landmark,
    "pincode": payload?.pincode,
    "city": payload?.city,
    "blood_group": payload?.bloodGroup,
    "height": payload?.height,
    "weight": payload?.weight,
    "dental_hygiene": payload?.dentalHygiene,
    "parents": payload?.parents?.map((p) => ({
      relation_with_student: p.relation,
      name: p.name,
      gender: p.gender?.toUpperCase(),
      phones: p.phones?.map(ph => ph?.toString()?.trim()).filter(Boolean) || [],
      emails: p.emails?.filter((em) => em && em.trim() !== "") || [],
      // qualification: p.qualification,
      // annual_income: p.annualIncome
    })) || [],
    // "siblings": (payload?.siblings || []).map((s) => ({
    //   name: s.name || null,
    //   admission_number: s.admission_number || null, // if you store it later
    //   class_id: s.classId || null,
    //   roll_number: s.roll_number || null, // optional
    // })),
    //   image_url: s.image_url || null

    "sibling_ids": payload?.siblings?.map(s => s.studentId) || [],

    "registered_phone_for_sms": payload?.smsRegisteredNumber,
    "emergency_contact_number": payload?.emergencyContactNumber,

    "previous_board": payload?.previousBoard,
    "previous_board_roll_number": payload?.previousRollNo,
    "previous_percentage": payload?.previousPercentage,
    "previous_working_day": payload?.previousWorkingDays,
    "permanent_address": payload?.permanent_address,
    "board_registration_number": payload?.boardRegNo,
    "year_of_passing": payload?.yearOfPassing,
    "permanent_education_number": payload?.permanentEduNo,
    "student_remarks": payload?.studentRemarks,
    "distance_to_school": payload?.distanceToSchool,
    "last_attended_school_name": payload?.previousSchool,


    "birth_certificate": payload?.documents?.birthCertificate?.uploadedUrl,
    "aadhaar_image": payload?.documents?.aadhar?.uploadedUrl,
    "family_photo": payload?.documents?.familyPhoto?.uploadedUrl,
    "image_url": payload?.documents?.profileImage?.uploadedUrl,

    "name_matches_with_aadhaar": payload?.name_matches_with_aadhaar,
    "date_of_birth_matches_with_aadhaar": payload?.date_of_birth_matches_with_aadhaar,
    "father_name_matches_with_aadhaar": payload?.father_name_matches_with_aadhaar,
    "address_matches_with_aadhaar": payload?.address_matches_with_aadhaar,


    "optional_subject_front_end": String(payload?.optionalSubjects.join(','))

  });
};



// ==================================================================================================

export const getStudentRecordFields = async (
  profileId,
  sessionId,
  payload = {}
) => {


  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");



  const requestBody = {
    api: "studentRecord.getFields",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
  };









  return axios.post(`${API_BASE_URL}/api`, requestBody);
};
