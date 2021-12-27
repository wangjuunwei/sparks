import "reflect-metadata";
import { AxiosInstance, AxiosResponse } from "axios";
import HttpTemplate from "../../module/HttpTemplate";
import {
  HttpTemplateMethod,
  ResMethodKey,
  ReqMethodQuery,
  ReqMethodParams,
  ReqMethodData,
  ReqMethodHeaders,
  CommonHttpTemplate,
  ReqHttpTransformRequest,
  ReqMethodKeyData,
  ReqMethodKeyParams,
  ReqMethodKeyQuery, ReqHttpBaseUrl, ResHttpResponseType,
  ReqHttpRequestConfig, ReqMethodCustromHeaders
} from "../types";


export const createHttpDecoratorFunction = (type: HttpTemplateMethod, url: string, _data: Record<string, any> = {}, headers: string[] = []) => {

  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // 保存原方法的值，方便后续步骤通过 apply 调用函数
    const method: any = descriptor.value;
    descriptor.value = async function(...argument: Record<string, any>[]) {
      const {
        reqDataKey,
        reqParamsKey,
        responseType,
        reqQueryKey,
        baseUrl,
        reqHttpTransform,
        requestHeaders,
        reqParamsIndex,
        reqQueryIndex,
        resIndex,
        reqDataIndex,
        requestConfigIndex,
        ReqMethodCustromHeadersIndex
      } = getMetadata(target, propertyKey);
      try {
        const args: Array<any> = [...argument];
        let query: Record<string, any> = {};
        let params: Record<string, any> = {};
        let postData: Record<string, any> = {};
        let httpUrl: string = url;
        let requestConfig: Record<string, any> = {};
        let customHeader: string[] = [];
        // 当存在 HttpQuery 注解时 会拿到被 HttpQuery 注解的参数, 拿到 httpBaseUrl
        // path 参数
        if (reqQueryIndex >= 0) {
          const dataObj = getHttpData(httpUrl, args[reqQueryIndex], reqQueryKey);
          query = dataObj.data;
          httpUrl = dataObj.httpUrl;
        }

        // 当存在 HttpParams 注解时 会拿到被 HttpParams 注解的参数 拿到 httpBaseUrl
        if (reqParamsIndex >= 0) {
          const dataObj = getHttpData(httpUrl, args[reqParamsIndex], reqParamsKey);
          params = dataObj.data;
          httpUrl = dataObj.httpUrl;
        }

        // post data数据
        if (reqDataIndex >= 0) {
          const dataObj = getHttpData(httpUrl, args[reqDataIndex], reqDataKey);
          httpUrl = dataObj.httpUrl;
          postData = dataObj.data;
        }

        if (requestConfigIndex >= 0) {

          requestConfig = args && args[requestConfigIndex];
        }

        if (ReqMethodCustromHeadersIndex >= 0) {
          customHeader = args && args[ReqMethodCustromHeadersIndex];
        }

        const requestHttpHeaders: any = [...requestHeaders, ...headers, ...customHeader];
        const res: any = await requestData(type, baseUrl ? baseUrl + httpUrl : httpUrl, {
          query,
          params,
          postData
        }, requestHttpHeaders, reqHttpTransform, responseType, requestConfig);

        if (isEmptyFunction(method) || resIndex === undefined || resIndex < 0) {

          return res;

        }
        if (resIndex >= 0) args.splice(resIndex, 1, res);


        return method.apply(this, args);
      } catch (error) {
        console.warn(error);
        throw error;
      }
    };
  };
};
/**
 * 获取请求数据
 * @param type
 * @param httpUrl
 * @param data
 * @param key
 */
export const getHttpData = (httpUrl: string, data: any, key?: string) => {
  for (const k in data) {
    httpUrl.replace(`:${key}`, data[k]);
  }
  if (key) {
    const result: any = {};
    result[key] = data[key];
    return { data: result, httpUrl };
  }
  return { data, httpUrl };
};

function getMetadata(target: any, propertyKey: string) {
  const resIndex: number = Reflect.getOwnMetadata(ResMethodKey, target, propertyKey);
  const reqQueryIndex: number = Reflect.getOwnMetadata(ReqMethodQuery, target, propertyKey);
  const reqParamsIndex: number = Reflect.getOwnMetadata(ReqMethodParams, target, propertyKey);
  const reqDataIndex: number = Reflect.getOwnMetadata(ReqMethodData, target, propertyKey);
  const reqDataKey: string = Reflect.getOwnMetadata(ReqMethodKeyData, target, propertyKey);
  const reqParamsKey: string = Reflect.getOwnMetadata(ReqMethodKeyParams, target, propertyKey);
  const reqQueryKey: string = Reflect.getOwnMetadata(ReqMethodKeyQuery, target, propertyKey);
  const reqHttpTransform: number = Reflect.getOwnMetadata(ReqHttpTransformRequest, target, propertyKey);
  const baseUrl: string = Reflect.getOwnMetadata(ReqHttpBaseUrl, target, propertyKey);
  const responseType: ResponseType = Reflect.getOwnMetadata(ResHttpResponseType, target, propertyKey);
  const requestHeaders: string[] = Reflect.getOwnMetadata(ReqMethodHeaders, target, propertyKey) || [];
  const requestConfigIndex: number = Reflect.getOwnMetadata(ReqHttpRequestConfig, target, propertyKey) || 0;
  const ReqMethodCustromHeadersIndex: number = Reflect.getMetadata(ReqMethodCustromHeaders, target, propertyKey) || 0;
  return {
    reqDataKey,
    reqParamsKey,
    responseType,
    reqQueryKey,
    baseUrl,
    reqHttpTransform,
    requestHeaders,
    reqParamsIndex,
    reqQueryIndex,
    resIndex,
    reqDataIndex,
    requestConfigIndex,
    ReqMethodCustromHeadersIndex
  };
}


/**
 * 获取配置
 * @param options
 */

export const getHeaderConfig = (options: string[]) => {
  return options.reduce((preValue, header) => {


    const match = header.match(/([^:]+):\s*(.*)/);
    if (!match) {
      throw new Error(`Invalid header format for '${header}'`);
    }
    const [, name, value] = match;
    if (!preValue[name]) {
      preValue[name] = "";
    }
    preValue[name] = value;
    return preValue;
  }, {} as Record<string, string>);
};


/**
 * http 请求实体
 * @param type
 * @param url
 * @param data
 * @param options
 * @param reqHttpTransform
 * @param responseType
 */
export function requestData(type: string, url: string, data: { query: any; params: any; postData: any; }, headers: any, reqHttpTransform: any, responseType: string, requestConfig: { [key: string]: any }) {
  const httpClient: CommonHttpTemplate = HttpTemplate({});
  const httpInstance: AxiosInstance = httpClient.httpInstance;
  return new Promise(async (resolve, reject) => {
    const { query, params, postData } = data;
    const header: any = getHeaderConfig(headers);
    const requestData: any = {
      ...{
        url: url,
        method: type,
        headers: header,
        params: JSON.stringify(query) === "{}" ? params : query,
        data: postData,
        responseType: responseType || "json"
      }, ...requestConfig
    };

    if (reqHttpTransform) {
      requestData["transformRequest"] = reqHttpTransform;
    }
    httpInstance.request(requestData).then((res: AxiosResponse) => {
      resolve(res);
    }).catch(e => {
      reject(e);
    });
  });
}


export function isEmptyFunction(func: any) {

  if (typeof func != "function") {
    return false;
  }
  let str = func.toString().replace(/\s+/g, "");
  str = str.match(/{.*}/g)[0];
  return str === "{}";

}
