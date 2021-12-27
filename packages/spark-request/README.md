# wsparks-request

wsparks-request 是一个采用元数据和装饰器封装Http请求工具

## Installation

```
pnpm install @wsparks/request
```

## API

#### 初始化实例
```typescript
// 初始化axios 实例对象
import HttpTemplate from '@wsparks/request'

/**
 * 初始化实例
 * @params
 *  - config axios 实例相关配置
 *  - requestInterceptorsFunc axios请求拦截函数
 *  - responseInterceptorsFunc axios 响应拦截函数
 */
HttpTemplate(config, requestInterceptorsFunc, responseInterceptorsFunc)
```
#### 设置请求头
```typescript
import {HttpHeader, CustomHttpHeader} from '@wsparks/request'
import {publish} from "@changesets/cli/dist/declarations/src/commands/publish/npm-utils";

/**
 * 设置请求Header
 * @params string[] 参数数组
 */
@HttpHeader(['Content-Type: application/json', "X-TESDID: 118798271"])
public async Text(){}

/**
 * 动态获取对应的参数设置header
 * @params string[] 参数数组
 */
public async Text(@CustomHttpHeader() customHeaders){}
```
#### 设置参数
```typescript
import {HttpQuery,HttpParams,HttpPostData,HttpTransformRequest,HttpBaseUrl,HttpConfig} from '@wsparks/request'

/**
 * 设置参数
 * @params Record<string,any> 参数
 */
public async Text(@HttpQuery() query){}
public async Text(@HttpParams() query){}
public async Text(@HttpPostData() query){}

/**
 * 设置请求基础参数
 * @params string 请求的url
 */
@HttpBaseUrl('url')
public async Text(){}


/**
 * 设置请求的config
 * @params Record<string,any>
 */
@HttpConfig(config)
public async Text(){}
```
#### 发送请求
```typescript
/**
 * 发送请求
 * @param url - 请求的url
 */
@HttpPost(url)
@HttpGet(url)
@HttpDelete(url)
@HttpOptions(url)
@HttpPatch(url)
public async Text(){}
```


#### 请求返回
```typescript

/**
 * 获取 http response
 */
public async Text(@HttpRes() response){
    console.log(response) // 打印返回值
}
```
