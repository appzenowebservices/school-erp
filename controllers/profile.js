import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfiles } from '../api/profile';
import { useAuthContext } from '../context/auth';

//=================================================================


export const useProfile = () => {
  const { guid, id } = useAuthContext();

  const queryClient = useQueryClient();
  //=================================================================
  const getUserProfileMutation = useMutation({
    mutationFn: getProfiles,
    onSuccess: (data) => {

      if (!data.data.success) {
        throw new Error(data.data.results.message);
      }

      queryClient.invalidateQueries(['userProfile']);

    },

    onError: (error) => {
      console.error('Failed to fetch user profile:', error);
    },
  });

  const getUserProfile = async () => {
    try {

      const data = await getUserProfileMutation.mutateAsync({ id, guid });
      return { success: true, data };
    } catch (error) {
      return { success: false, errorMessage: error?.response?.data?.message || 'Failed to fetch user profile' };
    }
  };



  //=================================================================

  return {
    getUserProfile,
    profileData: getUserProfileMutation?.data?.data?.results,
    isLoading: getUserProfileMutation.isLoading,
    isError: getUserProfileMutation.isError,
    error: getUserProfileMutation.error,

  };
};
