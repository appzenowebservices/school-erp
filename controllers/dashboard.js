import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserDashboardData } from '../api/dashboard';
import { useAuthContext } from '../context/auth';

//=================================================================


export const useDashboard = () => {
  const { guid, id } = useAuthContext();

  const queryClient = useQueryClient();
  //=================================================================
  const getUserDashboardMutation = useMutation({
    mutationFn: getUserDashboardData,
    onSuccess: (data) => {

      if (!data.data.success) {
        throw new Error(data.data.results.message);
      }

      queryClient.invalidateQueries(['userDashboard']);

    },

    onError: (error) => {
      console.error('Failed to fetch user Dashboard:', error);
    },
  });

  const getUserDashboard = async (profileId,sessionId) => {
    try {

      const data = await getUserDashboardMutation.mutateAsync({ profileId,sessionId, guid ,id});
      return { success: true, data };
    } catch (error) {
      return { success: false, errorMessage: error?.response?.data?.message || 'Failed to fetch user Dashboard' };
    }
  };



  //=================================================================

  return {
    getUserDashboard,
    dashboardData: getUserDashboardMutation?.data?.data?.results,
    isLoading: getUserDashboardMutation.isSuccess,
    isError: getUserDashboardMutation.isError,
    error: getUserDashboardMutation.error,

  };
};
