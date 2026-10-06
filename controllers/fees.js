import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFee, getFeeCollection, getStudentFee } from '../api/fees';
import { useAuthContext } from '../context/auth';

//=================================================================


export const useStudentFees = () => {
  const { guid, id } = useAuthContext();

  const queryClient = useQueryClient();
  //=================================================================
  const getUserFeesMutation = useMutation({
    mutationFn: getStudentFee,
    onSuccess: (data) => {

      if (!data.data.success) {
        throw new Error(data.data.results.message);
      }

      queryClient.invalidateQueries(['userStudentFees']);

    },

    onError: (error) => {
      console.error('Failed to fetch user Fees:', error);
    },
  });

  const getStudentFees = async (
    studentId,
    profileId,
    sessionId,

    guid,
    id,
  ) => {
    try {

      const data = await getUserFeesMutation.mutateAsync({
        studentId,
        profileId,
        sessionId,
        studentId,
        guid,
        id,
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, errorMessage: error?.response?.data?.message || 'Failed to fetch user Dashboard' };
    }
  };



  //=================================================================

  return {
    getStudentFees,
    studetnFeesData: getUserFeesMutation?.data?.data?.results,
    isLoading: getUserFeesMutation.isSuccess,
    isError: getUserFeesMutation.isError,
    error: getUserFeesMutation.error,

  };
};



//=================================================================


export const useFees = () => {

  const queryClient = useQueryClient();
  //=================================================================
  const getFeesMutation = useMutation({
    mutationFn: getFee,
    onSuccess: (data) => {

      if (!data.data.success) {
        throw new Error(data.data.results.message);
      }

      queryClient.invalidateQueries(['userFees']);

    },

    onError: (error) => {
      console.error('Failed to fetch user Fees:', error);
    },
  });

  const getFees = async (
    profileId,
    sessionId,

    page = 1,
    limit = 10,
    payload

  ) => {
    try {

      const data = await getFeesMutation.mutateAsync(
        profileId,
        sessionId,

        page,
        limit,
        payload
      );

      return { success: true, data };
    } catch (error) {
      return { success: false, errorMessage: error?.response?.data?.message || 'Failed to fetch user Dashboard' };
    }
  };



  //=================================================================

  return {
    getFees,
    feesResponse: getFeesMutation?.data?.data?.results, // <-- full payload: count, limit, fees[], next_page, ...
    feesData: getFeesMutation?.data?.data?.results?.fees,
    totalCount: getFeesMutation?.data?.data?.results?.count,
    isLoading: getFeesMutation?.isPending,
    limit: getFeesMutation?.data?.data?.results?.limit,
    offset: getFeesMutation?.data?.data?.results?.offset,
    next_page: getFeesMutation?.data?.data?.results?.next_page,
    prev_page: getFeesMutation?.data?.data?.results?.prev_page,
    isError: getFeesMutation.isError,
    error: getFeesMutation.error,

  };
};







//=================================================================


export const useFeeCollection = () => {

  const queryClient = useQueryClient();
  //=================================================================
  const getFeesCollectionMutation = useMutation({
    mutationFn: getFeeCollection,
    onSuccess: (data) => {

      if (!data.data.success) {
        throw new Error(data.data.results.message);
      }

      queryClient.invalidateQueries(['userFees']);

    },

    onError: (error) => {
      console.error('Failed to fetch user Fees:', error);
    },
  });

  const getFeesCollection = async (
    profileId,
    sessionId,

    guid,
    id,
    payload
  ) => {
    try {

      const data = await getFeesCollectionMutation.mutateAsync({
        profileId,
        sessionId,
        guid,
        id,
        payload
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, errorMessage: error?.response?.data?.message || 'Failed to fetch user Dashboard' };
    }
  };



  //=================================================================

  return {
    getFeesCollection,
    feeCollectionData: getFeesCollectionMutation?.data?.data?.results,
    isLoading: getFeesCollectionMutation.isSuccess,
    isError: getFeesCollectionMutation.isError,
    error: getFeesCollectionMutation.error,

  };
};




