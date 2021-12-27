import {ReqMethodCustromHeaders, ReqMethodHeaders,} from "./types/index";
import "reflect-metadata";

/**
 * 请求头部
 * @param headers<string[] | string>
 * @constructor
 */
export function HttpHeader(headers: string | string[]) {

    return headerDecoratorFactory(headers);
}

function headerDecoratorFactory(headers: string | string[]) {

    return function (target: any, propertyKey: string) {

        const headersConfig: string[] = typeof headers === "string" ? [headers] : headers;
        /**
         * @param metadataKey(ReqMethodHeaders) 设置或获取时的key
         * @param metadataValue(headersConfig) 元数据内容
         * @param target 待装饰的target
         * @param targetKey target的property
         */
        Reflect.defineMetadata(ReqMethodHeaders, headersConfig, target, propertyKey);
    };
}


/**
 * 请求参数注解   @HttpPostData()  | @HttpPostData('id')
 * @param key 参数key,当存在此参数时，请求参数中只会包含此key的值， 大部分情况下适用于 user/:id  类接口， 默认发送全部参数
 * @constructor
 */
export function CustomHttpHeader(_key?: string) {
    return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
        Reflect.defineMetadata(ReqMethodCustromHeaders, parameterIndex, target, propertyKey);
    };
}

