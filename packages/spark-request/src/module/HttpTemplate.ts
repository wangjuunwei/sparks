import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios/dist/axios";

type ErrorType =
  | "createHttpError" | "CREATE-HTTP-ERROR"
  | "promiseHttpError" | "PROMISE-HTTP-ERROR"
  | "requestInterceptorsError" | "REQUEST-INTERCEPTORS-ERROR"
  | "responseInterceptorsError" | "RESPONSE-INTERCEPTORS-ERROR"
type InterceptorsFunc = (instance: AxiosInstance) => AxiosInstance

interface CommonHttpTemplateConfig extends AxiosRequestConfig {
  timeout?: number
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
  responseInterceptors?: (data: AxiosResponse) => any
  error?: (errType: ErrorType, err: Error) => any,
  baseURL?: string
}

class HttpBaseTemplate {

  public commonHttpTemplateConfig: CommonHttpTemplateConfig;

  public httpInstance: AxiosInstance;

  constructor(props: CommonHttpTemplateConfig, requestInterceptorsFunc?: InterceptorsFunc, responseInterceptorsFunc?: InterceptorsFunc) {
    this.commonHttpTemplateConfig = props;
    this.httpInstance = this.createHttp(props);
    this.requestInterceptors(this.httpInstance, requestInterceptorsFunc);
    this.responseInterceptors(this.httpInstance, responseInterceptorsFunc);
  }


  /**
   * @summary 请求拦截器
   * @param instance 请求实例
   * @param requestInterceptorsFunc 请求拦截自定义函数
   */
  public requestInterceptors(instance: AxiosInstance, requestInterceptorsFunc?: InterceptorsFunc): AxiosInstance {

    if (requestInterceptorsFunc) requestInterceptorsFunc(instance);
    return instance;
  }

  /**
   * @summary 响应拦截
   * @param instance
   * @param responseInterceptorsFunc
   */
  public responseInterceptors(instance: AxiosInstance, responseInterceptorsFunc?: InterceptorsFunc): AxiosInstance {

    if (responseInterceptorsFunc) responseInterceptorsFunc(instance);
    return instance;
  }


  /**
   * http实例创建
   * @param props
   */
  public createHttp(props: CommonHttpTemplateConfig): AxiosInstance {

    return axios.create({ ...props });
  }
}

const HttpTemplate = (() => {
  let instance: any;
  return (config: CommonHttpTemplateConfig, requestInterceptorsFunc?: InterceptorsFunc, responseInterceptorsFunc?: InterceptorsFunc) => {
    if (!instance) {
      instance = new HttpBaseTemplate(config, requestInterceptorsFunc, responseInterceptorsFunc);
    }
    return instance;
  };
})();
export default HttpTemplate;
