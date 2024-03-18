import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";

export interface IRequestInterceptors {
  // 请求拦截
  requestSuccessFn?: (
    config: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig;
  requestCatchErrFn?: (err: any) => any;

  // 响应拦截
  responeSuccessFn?: <T = AxiosResponse>(res: T) => T;
  responeCatchErrFn?: (err: any) => any;
}

// 继承
export interface INewInternalAxiosRequestConfig
  extends InternalAxiosRequestConfig {
  interceptors?: IRequestInterceptors;
}
