import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAttendanceList, getAttendanceReportApi } from '../api/attendance';
import { useAuthContext } from '../context/auth';

//=================================================================


export const useAttendance = (
  profile,
  session,
  selectedDate,
  cookyGuid,
  selectedClassId,
  cookyId,
) => {
  const queryClient = useQueryClient();

  const getAttendanceMutation = useMutation({
    mutationFn: ({ profile,
      session,
      selectedDate,
      cookyGuid,
      selectedClassId,
      cookyId, }) =>
      getAttendanceList(
        profile,
        session,
        selectedDate,
        cookyGuid,
        selectedClassId,
        cookyId,
      ),

    onSuccess: (data) => {
      // console.log('aaya -------------------', data);

      if (!data.data.success) {
        throw new Error(data.data.results.message);
      }
    },

    onError: (error) => {
      console.error('Failed to fetch attendance:', error);
    },
  });

  const getAttendance = async () => {
    try {
      const response = await getAttendanceMutation.mutateAsync({
        profile,
        session,
        selectedDate,
        cookyGuid,
        selectedClassId,
        cookyId,
      });

      return {
        success: true,
        data: response?.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Attendance fetching failed',
      };
    }
  };

  return {
    getAttendance,
    attendanceData: getAttendanceMutation?.data?.data?.results,

    isPending: getAttendanceMutation.isPending,
    isSuccess: getAttendanceMutation.isSuccess,
    isError: getAttendanceMutation.isError,
    error: getAttendanceMutation.error,
  };
};





//=================================================================


export const useAttendanceReport = (
  profile,
  session,
  selectedDate,
  cookyGuid,
  selectedClassId,
  cookyId,
) => {
  const queryClient = useQueryClient();

  const getAttendanceReportMutation = useMutation({
    mutationFn: ({ profile,
      session,
      selectedDate,
      cookyGuid,
      selectedClassId,
      cookyId, }) =>
      getAttendanceReportApi(
        profile,
        session,
        selectedDate,
        cookyGuid,
        selectedClassId,
        cookyId,
      ),

    onSuccess: (data) => {
      // console.log('aaya -------------------', data);

      if (!data.data.success) {
        throw new Error(data.data.results.message);
      }
    },

    onError: (error) => {
      console.error('Failed to fetch attendance:', error);
    },
  });

  const getAttendanceReport = async () => {
    try {
      const response = await getAttendanceReportMutation.mutateAsync({
        profile,
        session,
        selectedDate,
        cookyGuid,
        selectedClassId,
        cookyId,
      });

      return {
        success: true,
        data: response?.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Attendance fetching failed',
      };
    }
  };

  return {
    getAttendanceReport,
    attendanceReportData: getAttendanceReportMutation?.data?.data?.results,

    isPending: getAttendanceReportMutation.isPending,
    isSuccess: getAttendanceReportMutation.isSuccess,
    isError: getAttendanceReportMutation.isError,
    error: getAttendanceReportMutation.error,
  };
};
