import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../context/auth';
import { getOnlineClasses } from '../api/onlineClasses';

//=================================================================


export const useOnlineClasses = () => {
  const { guid, id } = useAuthContext();

  const queryClient = useQueryClient();
  //=================================================================
  const getUserFeesMutation = useMutation({
    mutationFn: getOnlineClasses,
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

  const getStudentFees = async (profileId,sessionId) => {
    try {

      const data = await getUserFeesMutation.mutateAsync({ profileId,sessionId, guid ,id});
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
