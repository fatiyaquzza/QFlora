import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosClient = axios.create({
  baseURL: "http://45.80.181.4:5000",
});

axiosClient.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    const token = await currentUser.getIdToken(true);
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
