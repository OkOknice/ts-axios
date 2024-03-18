// import { rejects } from "assert";
import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import type {
  INewInternalAxiosRequestConfig,
  IRequestInterceptors,
} from "./types/types";

// 类型创建

// interface IRequestInterceptors {
//   // 请求拦截
//   requestSuccessFn?: (
//     config: InternalAxiosRequestConfig
//   ) => InternalAxiosRequestConfig;
//   requestCatchErrFn?: (err: any) => any;

//   // 响应拦截
//   responeSuccessFn?: <T = AxiosResponse>(res: T) => T;
//   responeCatchErrFn?: (err: any) => any;
// }

// // 继承
// interface INewInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
//   interceptors?: IRequestInterceptors;
// }

class OKOKRequest {
  // axios 实例
  instance: AxiosInstance;
  // 拦截对象
  interceptorsObj?: IRequestInterceptors;

  constructor(config: INewInternalAxiosRequestConfig) {
    // 创建实例
    this.instance = axios.create(config);
    // this.interceptorsObj = interceptorsObj
    this.interceptorsObj = config.interceptors;
    // 全局请求拦截
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        console.log("全局请求拦截");
        return config;
      },
      (err: any) => {
        return err;
      }
    );

    // 实例请求拦截器
    this.instance.interceptors.request.use(
      this.interceptorsObj?.requestSuccessFn,
      this.interceptorsObj?.requestCatchErrFn
    );
    // 实例响应拦截器
    this.instance.interceptors.response.use(
      this.interceptorsObj?.responeSuccessFn,
      this.interceptorsObj?.responeCatchErrFn
    );

    // 全局响应拦截
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        console.log("全局响应拦截");
        return res.data;
      },
      (err: any) => {
        return err;
      }
    );
  }
  // request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>; 这是 axios 官方对 request 的定义
  // request(config: InternalAxiosRequestConfig) {
  //   return this.instance.request(config);
  // }
  request<T>(config: INewInternalAxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      // 如果我们为单个请求设置拦截器，这里使用单个请求的拦截器
      if (config.interceptors?.requestSuccessFn) {
        config = config.interceptors.requestSuccessFn(config);
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 如果我们为单个响应设置拦截器，这里使用单个响应的拦截器
          if (config.interceptors?.responeSuccessFn) {
            res = config.interceptors.responeSuccessFn<T>(res);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  get(config: INewInternalAxiosRequestConfig) {
    return this.instance.request({
      method: "GET",
      ...config,
    });
  }
  post(config: INewInternalAxiosRequestConfig) {
    return this.instance.request({
      method: "POST",
      ...config,
    });
  }
}

export default OKOKRequest;
