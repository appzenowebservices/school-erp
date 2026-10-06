import axios from 'axios';
import ConfirmationDialogueBox from '../components/ui/status/Confirmation';

const httpClient = axios.create({
    baseURL: 'https://api.skooltree.com/',
    timeout: 5000,
});

// Request Interceptor: Attach token to requests
httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle expired sessions
httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            <ConfirmationDialogueBox
                title='Session Expired'
                description='Your session has expired. Please log in again.'
                onConfirm={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }}
                onCancel={() => { }}
            />
            // Notify the user that the session has expired
            window.dispatchEvent(new Event("sessionExpired"));

            // Clear token and redirect to login page
            localStorage.removeItem('token');
            // window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default httpClient;
