// lib/api-server.js (Same as before)
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

export const getUserDashboardData = async ({ profileId, sessionId, guid, id }) => {
    // console.log('Server-side: Fetching dashboard data...');
    // console.log('Server-side Params:', { profileId, sessionId, guid, id });

    if (!guid || !id || !sessionId) {
        console.error("Server-side Error: Missing required authentication parameters (guid, id, sessionId).");
        throw new Error("Authentication parameters are missing for dashboard data fetch.");
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/api`, {
            "api": "client.getDashboard",
            "guid": guid,
            "logged_in_user_account_id": id,
            "user_account_id": profileId,
            "client_id": sessionId,
            "platform": "web",
            "id": sessionId
        });

        return response.data;
    } catch (error) {
        console.error('Server-side Error fetching user dashboard data:', error.message);
        if (error.response) {
            console.error('API Response Error:', error.response.status, error.response.data);
        }
        throw new Error(`Failed to fetch user dashboard data: ${error.message}`);
    }
};