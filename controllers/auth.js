import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserFromUserName, userAccountLogin } from '../api/auth';
import { useAuthContext } from '../context/auth';
import Cookies from 'js-cookie';

//=================================================================


export const useAuth = () => {
  const { setAuthStates, id, setGuid } = useAuthContext();

  const queryClient = useQueryClient();
  //=================================================================
  const getUserByPhonMutation = useMutation({
    mutationFn: getUserFromUserName,
    onSuccess: (data) => {

      if (!data.data.success) {
        throw new Error(data.data.results.message);
      }

      // console.log('=============darta ========:', data?.data.results);
      // queryClient.invalidateQueries(['authStates']);
      setAuthStates(
        data?.data?.results?.id,
        data?.data?.results?.user_name,
        data?.data?.results?.name,
        null
      );
      localStorage.setItem('id', data?.data?.results?.id);
      localStorage.setItem('user_name', data?.data?.results?.user_name);
      localStorage.setItem('name', data?.data?.results?.name);
      Cookies.set('id', data?.data?.results?.id);
      Cookies.set('user_name', data?.data?.results?.user_name);
      Cookies.set('name', data?.data?.results?.name);

    },

    onError: (error) => {
      console.error('Failed to LOGIN:', error);
    },
  });

  const getUserByPhone = async (phoneNumber) => {
    try {
      const response = await getUserByPhonMutation.mutateAsync(phoneNumber);
      return {
        success: true,
        data: response?.data
      };
    } catch (error) {
      // console.log('Inventory error:', error.response.data.message);
      return { success: false, error: error?.message || 'Login failed' };
    }
  };


  //=================================================================

  const loginUserMutation = useMutation({
    mutationFn: userAccountLogin,
    onSuccess: (data) => {
      if (!data.data.success) {
        // Handle API error here
        throw new Error(data.data.results.message);

        // console.error('API error:', data.data.results.message);
        // return;
      }

      // console.log('Inventory Added:', data);
      queryClient.invalidateQueries(['authStatesLogin']);
      setGuid(data?.data?.results?.guid);
      localStorage.setItem('guid', data?.data?.results?.guid);
      Cookies.set('guid', data?.data?.results?.guid);


    },

    onError: (error) => {
      console.error('Failed to Login verify:', error);
    },
  });

  const userLogin = async (password) => {
    try {

      const response = await loginUserMutation.mutateAsync({ password, id });
      return {
        success: true,
        data: response?.data
      };
    } catch (error) {
      // console.log('Inventory error:', error.response.data.message);
      return { success: false, error: error?.message || 'Login failed' };
    }
  };


  //=================================================================

  return {
    getUserByPhone,
    userLogin,
    isPending: getUserByPhonMutation.isPending,
    isSuccess: getUserByPhonMutation.isSuccess,
    isError: getUserByPhonMutation.isError,
    error: getUserByPhonMutation.error,

  };
};
