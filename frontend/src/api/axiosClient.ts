import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import queryString from "query-string";

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    config.headers.set("Content-Type", "application/json");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor cho response
axiosClient.interceptors.response.use(
  <T>(response: AxiosResponse<T>): T => {
    if (response && response.data) return response.data;
    throw new Error("No data in response");
  },
  (err) => {
    if (!err.response) {
      console.error("Network Error:", err.message);
      alert("Network Error: Unable to connect to the server.");
    }
    return Promise.reject(err.response || err);
  },
);

export default axiosClient;
