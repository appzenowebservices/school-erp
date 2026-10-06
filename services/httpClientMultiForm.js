import axios from 'axios';
import { devURL } from '../config/server';

const httpClientMultiForm = axios.create({
    baseURL: devURL,
    timeout: 5000,
});

// Request Interceptor: Attach token & set Content-Type for FormData
httpClientMultiForm.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;

        // Check if request data is FormData and set the appropriate Content-Type
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle expired sessions
httpClientMultiForm.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Notify the user that the session has expired
            window.dispatchEvent(new Event("sessionExpired"));

            // Clear token and redirect to login page
            localStorage.removeItem('token');
            // window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default httpClientMultiForm;
