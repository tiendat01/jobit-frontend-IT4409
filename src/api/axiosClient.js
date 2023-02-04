import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    headers: {
        "content-type": "application/json",
    },
    paramsSerializer: (params) => queryString.stringify(params),
    timeout: 100 * 1000
});
axiosClient.interceptors.request.use(async (config) => {
    // const token = await getFirebasetoken();
    const currentPath = window.location.pathname.split("/")[1];

    const token = localStorage.getItem(currentPath === "admin" || currentPath === "checkadmin" ? "token-admin" : "token");
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        // Handle errors
        throw error;
    }
);

export default axiosClient;
