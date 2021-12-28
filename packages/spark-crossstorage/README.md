# @wsparks/crossStorage

<br/>
 主要用于非同源标签之间的通信
<br/>

## 运行
<br/>

```shell
$ pnpm install 
$ pnpm run example:client
$ pnpm run example:server
```
访问 http://127.0.0.1:8090/example/sparkClient.html 即可查看效果


## API

#### 发起方
```typescript
import {sparkCrossClient} from '@wsparks/crossStorage'

/**
 * 客户端，发起数据传输请求
 * @params 
 *  - postUrl 接受数据的url
 *  - params 发送的参数
 *  - postTimeout 发送的超时时间
 * 
 */
sparkCrossClient(postUrl, params, postTimeout)
```

### 接收方
```typescript
import {SparkCrossServer} from '@wsparks/crossStorage';

/**
 * 服务端，接收客户端发送的数据
 * @params
 *  - timeout 接收超时时间
 *  - localStroageTimeout 有时效的localStroage 的超时时间
 */
const server = new SparkCrossServer({ timeout, localStroageTimeout });
server.onConnect()
    .then(res => { 获取对应传递信息 })
    .catch(err => { 获取对应报错信息 })
```
