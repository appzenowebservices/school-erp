import axios from 'axios';
import { API_BASE_URL } from '../config/server';
import { getCookie } from 'cookies-next';

// ========================================================================================================
export const getStudentFee = async (
  studentId,
  profileId,
  sessionId,

) => {


  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  return axios.post(`${API_BASE_URL}/api`, {
    api: 'student.getFees',
    id: studentId,
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: 'web'
  });
};

//========================================================================================================

export const getFee = async (
  profileId,
  sessionId,
  page,
  limit,
  payload,
) => {
  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  // Build request body dynamically
  const requestBody = {
    api: "fee.getList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    page,
    limit,
  };

  // Only include "type" if feeType has a real value
  if (payload?.feeType && payload.feeType.trim() !== "") {
    requestBody.type = payload.feeType;
  }
  if (payload?.standards && payload.standards.length > 0) {
    requestBody.standard_ids = payload.standards;
  }
  if (payload?.hostelFee && payload.hostelFee.trim() !== "") {
    requestBody.is_hostel_fee = payload.hostelFee;
  }
  if (payload?.enabled && payload.enabled.trim() !== "") {
    requestBody.is_disabled = payload.enabled;
  }

  if (payload?.dueDate && payload.dueDate.trim() !== "") {
    requestBody.due_date = payload.due_date;
  }





  if (payload?.startDate && payload.startDate.trim() !== "") {
    requestBody.start_date = payload.startDate;
  }

  if (payload?.endDate && payload.endDate.trim() !== "") {
    requestBody.end_date = payload.endDate;
  }


  if (payload?.name && payload.name.trim() !== "") {
    requestBody.name = payload.name;
  }
  if (payload?.serial_number && payload.serial_number.trim() !== "") {
    requestBody.serial_number = payload.serial_number;
  }




  return axios.post(`${API_BASE_URL}/api`, requestBody);
};

//========================================================================================================

export const getLateFee = async (
  profileId,
  sessionId,
  page,
  limit,
  payload,
) => {
  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  // Build request body dynamically
  const requestBody = {
    api: "lateFee.getList",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    platform: "web",
    page,
    limit,
  };

  // Only include "type" if feeType has a real value
  if (payload?.feeType && payload.feeType.trim() !== "") {
    requestBody.type = payload.feeType;
  }
  if (payload?.standards && payload.standards.length > 0) {
    requestBody.standard_ids = payload.standards;
  }
  if (payload?.hostelFee && payload.hostelFee.trim() !== "") {
    requestBody.is_hostel_fee = payload.hostelFee;
  }
  if (payload?.enabled && payload.enabled.trim() !== "") {
    requestBody.is_disabled = payload.enabled;
  }

  if (payload?.dueDate && payload.dueDate.trim() !== "") {
    requestBody.due_date = payload.due_date;
  }





  if (payload?.startDate && payload.startDate.trim() !== "") {
    requestBody.start_date = payload.startDate;
  }

  if (payload?.endDate && payload.endDate.trim() !== "") {
    requestBody.end_date = payload.endDate;
  }


  if (payload?.name && payload.name.trim() !== "") {
    requestBody.name = payload.name;
  }
  if (payload?.serial_number && payload.serial_number.trim() !== "") {
    requestBody.serial_number = payload.serial_number;
  }




  return axios.post(`${API_BASE_URL}/api`, requestBody);
};


//========================================================================================================

export const addLateFee = async (
  profileId,
  sessionId,

  payload,
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  // Build request body dynamically
  const requestBody = {
    api: "lateFee.add",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",

    ...payload

  };





  return axios.post(`${API_BASE_URL}/api`, requestBody);
};


//========================================================================================================

export const deleteLateFee = async (
  profileId,
  sessionId,

  id,
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  // Build request body dynamically
  const requestBody = {
    api: "lateFee.delete",
    guid: resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",

    id

  };





  return axios.post(`${API_BASE_URL}/api`, requestBody);
};
// ========================================================================================================

export const getFeeTypeDetail = async (
  { profileId,
    sessionId,
    feeTypeId }
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");



  // console.log('======== getFee ==========',

  //   profileId,
  //   sessionId,
  //   guid,
  //   id,
  //   resolvedGuid,
  //   resolvedUserId
  // );

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "fee.getDetails",
    "guid": resolvedGuid,
    logged_in_user_account_id: resolvedUserId,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    "id": feeTypeId

  });
};




//========================================================================================================

export const postFee = async (
  profileId,
  sessionId,
  payload
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");



  // console.log('======== payload ==========', profileId, payload);

  return axios.post(`${API_BASE_URL}/api`,
    {
      "api": "fee.add",
      "guid": resolvedGuid,
      "logged_in_user_account_id": resolvedUserId,
      "user_account_id": profileId,
      "client_id": sessionId,
      "platform": "WEB",



      ...payload


      // "standard_ids": [
      //   "7435",
      //   "7436",
      //   "7437"
      // ],
      // "name": "Demo Fee",
      // "serial_number": "22",
      // "is_miscellaneous": "0",
      // "type": "HALF YEARLY",
      // "start_date": "2021-01-01",
      // "end_date": "2021-06-30",
      // "due_date": "2021-07-07",
      // "include_transport_fee": "1",
      // "is_online_payment_allowed": "1",
      // "number_of_months": "6",
      // "transport_fee_multiplier": "1",
      // "is_partial_payment_allowed": "1",
      // "is_disabled": "0",
      // "is_adjustment_amount_applicable": "1",
      // "show_break_up_on_receipt": "1",
      // "fee_types_amount": [
      //   {
      //     "fee_type_id": "445",
      //     "amount": "2.00"
      //   },
      //   {
      //     "fee_type_id": "446",
      //     "amount": "100.00"
      //   },
      //   {
      //     "fee_type_id": "447",
      //     "amount": "0"
      //   }
      // ]
    }


  );
};



//========================================================================================================

export const updateFeePermission = async (
  profileId,
  sessionId,
  payload
) => {

  let resolvedGuid = getCookie("guid");
  let resolvedUserId = getCookie("id");

  // console.log("resps -------------->", payload);



  return axios.post(`${API_BASE_URL}/api`,
    {
      "api": "client.setOnlinePaymentPermission",
      "guid": resolvedGuid,
      "logged_in_user_account_id": resolvedUserId,
      "user_account_id": profileId,
      "client_id": sessionId,
      "id": sessionId,

      "platform": "WEB",



      ...payload


    }

  );
};


//========================================================================================================

export const getFeeCollection = async ({
  profileId,
  sessionId,
  guid,
  id,
  payload

}) => {


  // console.log('====================================== payload : ', payload);

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "client.getFeeCollections",
    "guid": guid,
    logged_in_user_account_id: id,
    user_account_id: profileId,
    client_id: sessionId,
    "platform": "web",
    "id": sessionId,
    "mode": payload.mode,
    "class_ids": payload.class_ids,
    "is_promoted_student": payload.is_promoted_student,
    "is_new_student": payload.is_new_student,
    "only_deposited": payload.only_deposited,
    "deposit_start_date": payload.depositStartDate,
    "deposit_end_date": payload.depositEndDate,

  });
};





//========================================================================================================

export const getFeeCollectionSummary = async ({
  profileId,
  sessionId,
  guid,
  id,
  payload

}) => {



  return axios.post(`${API_BASE_URL}/api`, {
    "api": "client.getFeeCollectionSummary",
    "guid": "1758272216.8501skt68cd1ad8cf8976.28502279",
    "logged_in_user_account_id": "885283",
    "user_account_id": "558664",
    "client_id": "2200",
    "id": "2200",
    "platform": "WEB"
  });
};


//========================================================================================================

export const getFeeNameWiseSummary = async ({
  profileId,
  sessionId,
  guid,
  id,
  payload

}) => {



  return axios.post(`${API_BASE_URL}/api`, {
    "api": "client.getFeeNameWiseSummary",
    "guid": "1758272216.8501skt68cd1ad8cf8976.28502279",
    "logged_in_user_account_id": "885283",
    "user_account_id": "558664",
    "client_id": "2200",
    "platform": "WEB"
  });
};

//========================================================================================================



export const markStudentFee = async (
  profileId, session, payload
) => {
  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");
  console.log('payload', payload);

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "user.markStudentFee",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "WEB",
    ...payload,


  });
};


//========================================================================================================



export const getFeeTypes = async (
  profileId, session,
  page,
  limit,
) => {
  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  return axios.post(`${API_BASE_URL}/api`, {
    "api": "feeType.getList",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "WEB",
    page,
    limit,



  });
};




//========================================================================================================



export const getFeeTypeStudents = async (
  profileId,
  session,

) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");

  return axios.post(`${API_BASE_URL}/api`, {


    "api": "client.getFeeTypeStudents",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "platform": "WEB",
    "client_id": session,
    "id": session,
    // "fee_type_id": "2247",
    // "standard_id": "34115",
    // "fee_id": "17303",
    // "class_id": "100009",
    "is_variable": 1



  });
};

//========================================================================================================

export const addVariableFeeTypeStudentApi = async (
  profileId,
  session,
  payload
) => {
  console.log(payload, payload?.classId, 'addVariableFeeTypeStudentApi ===========')

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {


    "api": "classRoom.setFeeTypeStudents",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "platform": "WEB",
    "client_id": session,
    // "id": session,
    "fee_type_id": payload?.selectedFeeTypeId,
    // "standard_id": "34115",
    "fee_ids": payload?.selectedFees,
    "student_ids": [payload?.selectedStudent?.id],
    "id": payload?.classId,
    // "is_variable": 1



  });
};


//========================================================================================================

export const removeStudentFromFeeApi = async (
  profileId,
  session,
  payload
) => {
  // console.log(profileId,payload, 'removeStudentFromFeeApi ===========')

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {


    "api": "feeType.removeStudentFromFee",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "platform": "WEB",
    "client_id": session,
    "student_id": payload?.studentId,
    "fee_id": payload?.feeId,
    "id": payload?.feeTypeId,



  });
};


//========================================================================================================

export const addFeeType = async (
  profileId,
  session,
  payload
) => {
  console.log('payload_________ 📦📦', payload);

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {


    "api": "feeType.add",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",
    "serial_number": payload?.sn,
    "fee_types": payload?.parent_id,
    "name": payload?.name,
    "code": payload?.code,
    "is_miscellaneous": payload?.is_miscellaneous ? "1" : "0",
    "is_applicable_for_new_students": payload?.is_miscellaneous ? "1" : "0",
    "is_applicable_for_promoted_students": payload?.is_applicable_for_promoted_students ? "1" : "0",
    "is_optional": payload?.is_optional ? "1" : "0",
    "is_applicable_for_concession": payload?.is_applicable_for_concession ? "1" : "0",
    "is_variable": payload?.is_variable ? "1" : "0",
    "is_editable": payload?.is_editable ? "1" : "0",


  });
};


//========================================================================================================

export const getFeeTypeStudentsApi = async (
  profileId,
  session,
  selectedFeeType
) => {
  // console.log(profileId,payload, 'removeStudentFromFeeApi ===========')

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {




    "api": "feeType.getStudents",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",
    "id": selectedFeeType



  });
};

//========================================================================================================

export const deleteFeeTypeStudentsApi = async (
  profileId,
  session,
  selectedFeeTypeStudent,
  selectedInstallment,
  selectedFeeType_
) => {
  console.log(
    // selectedFeeTypeStudent,

    selectedFeeType_, 'payload ===========')

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {





    "api": "feeType.removeStudentFromFee",
    // "api": "feeType.removeStudent",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "platform": "web",
    "client_id": session,
    "id": selectedFeeType_?.id,
    "student_id": selectedFeeTypeStudent?.id,
    "fee_id": selectedInstallment?.id



  });

};





//========================================================================================================

export const waiveOffLateFeeList = async (
  profileId,
  session,
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {




    "api": "waiveOffLateFee.getList",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web"


  });
};




//========================================================================================================

export const deleteWaiveOffLateFee = async (
  profileId,
  session,
  waiveOffLateFeeId
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "waiveOffLateFee.delete",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",
    "id": waiveOffLateFeeId
  });
};


//========================================================================================================

export const getShcoolBusesList = async (
  profileId,
  session,

) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "schoolBus.getList",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web"
  });
};



//========================================================================================================

export const getSchoolBusStudentList = async (
  profileId,
  session,
  busId
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "schoolBus.getStudents",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",
    "id": busId
  });
};

//========================================================================================================

export const addSchoolBusStudent = async (
  profileId,
  session,
  payload
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "schoolBus.addStudent",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",
    "pickup_location": payload?.pickup_location,
    "class_id": payload?.class_id,
    "student_id": payload?.student_ids,
    "id": payload?.busId
  });
};

//========================================================================================================

export const deleteSchoolBusStudent = async (
  profileId,
  session,
  selectedStudent,
  busId
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "schoolBus.removeStudent",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",

    "student_id": selectedStudent?.id,
    "id": busId
  });
};




//========================================================================================================

export const getFeeDefaultersList = async (
  profileId,
  session,

  payload
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");
  // Build request body dynamically
  const requestBody = {
    "api": "classRoom.getFeeDefaulters",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",
    id: payload.classes[0]

  };


  if (payload?.classes) {
    requestBody.class_id = payload.classes;
  }
  if (payload?.as_on_date) {
    requestBody.defaulter_as_on = payload.as_on_date;
  }


  return axios.post(`${API_BASE_URL}/api`, requestBody);


};


//========================================================================================================

export const getPayoutList = async (
  profileId,
  session
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "payout.getList",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web"
  });
};





//========================================================================================================

export const getStudentFeeDetails = async (
  profileId,
  session,
  selectedStudentId
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "student.getFeeDetails",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",
    id: selectedStudentId
  });
};



//========================================================================================================

export const getFeePaymentDetails = async (
  profileId,
  session,
) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "client.getFeePaymentDetails",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",
    id: session
  });
};





//========================================================================================================

export const getCalculatedLateFeeApi = async (
  profileId,
  session,
  payload
) => {
  console.log('payload', payload);

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "student.calculateLateFee",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web",
    id: payload?.studentId,
    "fee_id": payload?.fee_id,
    "date": payload?.date
  });
};


//========================================================================================================

export const getTransportLocationList = async (
  profileId,
  session,

) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "location.getList",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "web"
  });
};

//========================================================================================================

export const updateTransportLocation = async (
  profileId,
  session,
  payload

) => {

  const resolvedGuid = getCookie("guid");
  const resolvedUserId = getCookie("id");


  return axios.post(`${API_BASE_URL}/api`, {

    "api": "location.edit",
    "guid": resolvedGuid,
    "logged_in_user_account_id": resolvedUserId,
    "user_account_id": profileId,
    "client_id": session,
    "platform": "WEB",
    "id": payload?.id,
    "name": payload?.name,
    "transport_fee": payload?.transport_fee
  });
};