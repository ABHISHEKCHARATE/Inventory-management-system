import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Django backend base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to refresh the access token
const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
            'http://127.0.0.1:8000/api/token/refresh/',
            { refresh: refreshToken }
        );
        const { access } = response.data;

        // Update localStorage with the new access token
        localStorage.setItem('access_token', access);  // Updated key to 'access_token'

        return access;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
};

// Add an interceptor to attach the token to every request
instance.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('access_token');  // Correct token key name

        if (!token) {
            throw new Error('No token found');
        }

        const tokenExpirationTime = parseJwt(token).exp * 1000;
        const currentTime = Date.now();

        // Check if the token is expired
        if (currentTime > tokenExpirationTime) {
            // Refresh the token if expired
            token = await refreshAccessToken();
        }

        config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Function to parse the JWT and get the expiration time
const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(
        atob(base64Url)
            .split('')
            .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
            .join('')
    );
    return JSON.parse(base64);
};

// Add a response interceptor to handle token expiration
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Check if the error is due to token expiration (401)
        if (error.response && error.response.status === 401) {
            try {
                const newToken = await refreshAccessToken();
                error.config.headers['Authorization'] = `Bearer ${newToken}`;
                return axios(error.config); // Retry the original request with the new token
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                // Optionally, you can log the user out here or handle other token-related logic
                // e.g., window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
