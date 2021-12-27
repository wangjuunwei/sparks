import {createHttpDecoratorFunction} from './common/createHttpDecoratorFunction'

/**
 * post post请求
 * @param url<string> 接口的地址 /options/post
 * @param data<any> 请求参数，动态赋予
 * @param headers<string[] | string> 请求头部参数 建议直接使用HttpHeader 注解
 * @constructor
 */
export function HttpPost(url: string, data?: any, headers: string[] = []) {

    return createHttpDecoratorFunction("POST", url, data, headers)
}

/**
 * get get请求
 * @param url<string> 接口地址 /options/get | /options/get/:id
 * @param data<any> 请求参数，动态赋予
 * @param headers<string[] | string> 请求头部参数 建议直接使用HttpHeader 注解
 * @constructor
 */
export function HttpGet(url: string, data?: any, headers: string[] = []) {

    return createHttpDecoratorFunction("GET", url, data, headers)
}

/**
 * delete delete请求
 * @param url<string> 接口地址 /options/delete | /options/delete/:id
 * @param data<any> 请求参数，动态赋予
 * @param headers<string[] | string> 请求头部参数 建议直接使用HttpHeader 注解
 * @constructor
 */
export function HttpDelete(url: string, data?: any, headers: string[] = []) {

    return createHttpDecoratorFunction('DELETE', url, data, headers)
}


/**
 * options请求 options请求
 * @param url<string> 接口地址
 * @param data<Object> 请求参数 一般参数都是动态参数，不会采用这中方式
 * @param headers<string[] | string> 请求头部参数 建议直接使用HttpHeader 注解
 * @constructor
 */
export function HttpOptions(url: string, data?: any, headers: string[] = []) {
    return createHttpDecoratorFunction('OPTIONS', url, data, headers)
}

/**
 * patch patch请求
 * @param url<string> 接口地址
 * @param data<Object> 请求参数 一般参数都是动态参数，不会采用这中方式
 * @param headers<string[] | string> 请求头部参数 建议直接使用HttpHeader 注解
 * @constructor
 */
export function HttpPatch(url: string, data?: any, headers: string[] = []) {
    return createHttpDecoratorFunction('PATCH', url, data, headers)
}
