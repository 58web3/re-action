import axios, { AxiosAdapter } from "axios";
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer,
} from "axios-extensions";
import LRUCache from "lru-cache";
import { API_ENDPOINT, API_TIMEOUT_MILLISEC } from "@/constants/api";

const AxiosPlugin = {
  install(app: any) {
    if (!app.config.globalProperties.$axios) {
      const lruOptions = {
        max: 20,
        ttl: 1000 * 60 * 30,
        maxSize: 200 * 1024 * 1024,
        sizeCalculation: (value: any, key: any) => {
          return 1;
        },
      };
      const axios_ = axios.create({
        baseURL: "/",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
        withCredentials: true,
        // adapter: cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter),
        adapter: throttleAdapterEnhancer(
          cacheAdapterEnhancer(axios.defaults.adapter as AxiosAdapter),
          { threshold: 2 * 1000, cache: new LRUCache(lruOptions) }
        ),
        timeout: API_TIMEOUT_MILLISEC,
      });
      const config = JSON.parse(sessionStorage.getItem("token") as string);
      if (config) {
        axios_.defaults.headers.common["jwt"] = `Bearer ${config.idToken}`;
        axios_.defaults.headers.common["public_key"] = config.app_pub_key;
      }
      app.config.globalProperties.$axios = axios_;
    }
  },
};

export default AxiosPlugin;
