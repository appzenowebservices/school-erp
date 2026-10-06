import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStaffApi } from '../api/staff';




//=================================================================


export const useStaff = () => {

  const queryClient = useQueryClient();
  //=================================================================
  const getStaffMutation = useMutation({
    mutationFn: getStaffApi,
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

  const getStaff = async (
    profileId,
    sessionId,
    params,
    page
  ) => {
    try {

      const data = await getStaffMutation.mutateAsync({
        profileId,
        sessionId,
        params,
        page
      });

      return { success: true, data };
    } catch (error) {
      return { success: false, errorMessage: error?.response?.data?.message || 'Failed to fetch user Dashboard' };
    }
  };



  //=================================================================

  return {
    getStaff,
    stadffData: getStaffMutation?.data?.data?.results,
    isLoading: getStaffMutation.isSuccess,
    isError: getStaffMutation.isError,
    error: getStaffMutation.error,

  };
};




