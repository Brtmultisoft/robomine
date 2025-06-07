import axios from "axios";
import { toast } from "react-toastify";
import { getLocalStorageToken } from "../utils/CommonFunction";

// Use the correct Vite environment variable based on test/prod mode
const isTestMode = process.env.VITE_APP_TEST === '1';
const testApiUrl = process.env.VITE_APP_TEST_API_URL;
const prodApiUrl = process.env.VITE_APP_PROD_API_URL;

// Construct base URL with proper trailing slash handling
let baseURL = isTestMode ? testApiUrl : prodApiUrl;

// Ensure baseURL ends with /
if (baseURL && !baseURL.endsWith('/')) {
    baseURL = baseURL + '/';
}

// Fallback to localhost if environment variables are not set
const finalBaseURL = baseURL || 'http://localhost:4000/';

// Debug logging
console.log('🔧 Admin API Configuration:', {
    isTestMode,
    testApiUrl,
    prodApiUrl,
    baseURL,
    finalBaseURL,
    adminApiURL: finalBaseURL + 'admin/'
});

const errorMessagesDisplayed = new Set();

const confg = async (data) => {
    try {
        const response = await axios({
            method: data?.method,
            url: finalBaseURL + data?.url,
            headers: data?.headers,
            params: data?.params,
            data: data?.data,
        });
        return response;
    } catch (error) {
        // Check if the error message has already been displayed
        const errorMessage =
            error?.response?.data?.message || "something went wrong";
        if (!errorMessagesDisplayed.has(errorMessage)) {
            errorMessagesDisplayed.add(errorMessage);
            if (
                error?.response?.data?.message &&
                (typeof error?.response?.data?.message == "object" ||
                    Array.isArray(error?.response?.data?.message))
            ) {
                for (const property in error?.response?.data?.message) {
                    toast.error(`${error?.response?.data?.message[property]}`);
                }
            } else {
                toast.error(errorMessage);
            }
        }

        if (error?.response?.status === 401) {
            setTimeout(() => {
                localStorage.removeItem("Login");
                window?.location?.replace("/");
            }, 2000);
        } else {
            errorMessagesDisplayed.clear();
        }

        throw new Error(error);
    }
};

// Create axios instance for admin API
const adminApiBaseURL = finalBaseURL + 'admin/';
export const adminApi = axios.create({
    baseURL: adminApiBaseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

console.log('🚀 Admin API Configuration Complete:', {
    finalBaseURL,
    adminApiBaseURL,
    fullMintingURL: adminApiBaseURL + 'minting/prepare-minting'
});

// Add request interceptor to include auth token
adminApi.interceptors.request.use(
    (config) => {
        // Try both token keys - serviceToken (from JWTContext) and Login (legacy)
        let token = localStorage.getItem('serviceToken') || getLocalStorageToken('Login');

        console.log('🔑 Admin Token Debug:', {
            serviceToken: !!localStorage.getItem('serviceToken'),
            loginToken: !!getLocalStorageToken('Login'),
            tokenExists: !!token,
            tokenLength: token ? token.length : 0,
            tokenPreview: token ? token.substring(0, 20) + '...' : 'No token',
            url: config.url,
            method: config.method
        });

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn('⚠️ No admin token found in localStorage (checked both serviceToken and Login)');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
adminApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('🚨 Admin API Error:', {
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data,
            url: error?.config?.url,
            method: error?.config?.method,
            headers: error?.config?.headers
        });

        const errorMessage = error?.response?.data?.message || "something went wrong";

        if (!errorMessagesDisplayed.has(errorMessage)) {
            errorMessagesDisplayed.add(errorMessage);
            if (
                error?.response?.data?.message &&
                (typeof error?.response?.data?.message == "object" ||
                    Array.isArray(error?.response?.data?.message))
            ) {
                for (const property in error?.response?.data?.message) {
                    toast.error(`${error?.response?.data?.message[property]}`);
                }
            } else {
                toast.error(errorMessage);
            }
        }

        if (error?.response?.status === 401) {
            console.warn('🔐 401 Unauthorized - Admin token invalid or expired');
            toast.error('Admin session expired. Please login again.');
            setTimeout(() => {
                // Clear both possible token keys
                localStorage.removeItem("serviceToken");
                localStorage.removeItem("Login");
                window?.location?.replace("/");
            }, 2000);
        } else {
            errorMessagesDisplayed.clear();
        }

        return Promise.reject(error);
    }
);

export default adminApi;