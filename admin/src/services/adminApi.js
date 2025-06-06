import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { getLocalStorageToken } from "../utils/CommonFunction";
import CommonMessage from "../utils/commonMessage";

const baseURL = process.env.REACT_APP_APIURL;

const errorMessagesDisplayed = new Set();

const confg = async (data) => {
    try {
        const response = await axios({
            method: data?.method,
            url: baseURL + data?.url,
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
export const adminApi = axios.create({
    baseURL: baseURL + 'admin/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
adminApi.interceptors.request.use(
    (config) => {
        const token = getLocalStorageToken('Login');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
            setTimeout(() => {
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