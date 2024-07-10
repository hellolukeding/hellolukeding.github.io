# Threejs.Loader 的生命周期

## 构造函数

```typescript
class loader{
//构造函数
constructor(manager:LoadingManager){}
/////////////////////////////////////
//properties
crossOrigin:string //用于实现 CORS 的 crossOrigin 字符串，用于从允许 CORS 的不同域加载 url。默认为 anonymous 。
withCredentials : Boolean //XMLHttpRequest 是否使用证书。请参阅.setWithCredentials。默认为 false 。
manager : LoadingManager //加载器正在使用的loadingManager。默认是DefaultLoadingManager。
path:string //将从中加载附加资源（例如纹理）的基本路径。默认为空字符串。
requestHeader : Object //HTTP 请求中使用的请求标头。请参阅.setRequestHeader。默认为空对象。
/////////////////////////////////////
//method
load() //该方法需要由所有具体加载器实现。它保存从后端加载资源的逻辑。
loadAsync ( url : String, onProgress : Function ) : Promise //
parse() // 该方法需要由所有具体加载器实现。它包含将资产解析为threejs 实体的逻辑。
setCrossOrigin() // crossOrigin — 用于实现 CORS 的 crossOrigin 字符串，用于从允许 CORS 的不同域加载 url。
setWithCredentials () // XMLHttpRequest 是否使用 cookie、授权标头或 TLS 客户端证书等凭据。请参阅 XMLHttpRequest.withCredentials。
setPath() //设置资源路径
setResourcePath （）//resourcePath — 设置依赖资源（如纹理）的基本路径。
setRequestHeader() //
}
```

## 生命周期

1. **初始化**:

   - 当实例化一个加载器时,如 `const loader = new THREE.JSONLoader();`，加载器对象被创建。
   - 在这个阶段,可以设置加载器的一些属性,如 `loader.setPath()`、`loader.setResourcePath()`等。

2. **加载**:

   - 当调用加载器的 `load()`方法时,如 `loader.load(url, onLoad, onProgress, onError)`，加载过程开始。
   - `load()`方法内部会调用浏览器的文件读取 API,如 `fetch()`或 `XMLHttpRequest`，来从指定的 URL 异步加载资源。

3. **进度**:

   - 在加载过程中,如果有进度信息可用,加载器会周期性地调用 `onProgress`回调函数。
   - 这个回调函数会接收一个包含已加载字节数和总字节数的对象作为参数。

4. **解析**:

   - 当资源加载完成后,加载器会调用 `onLoad`回调函数。
   - 在这个回调函数中,加载器会将加载的原始数据传递给自定义的 `parse()`方法,由 `parse()`方法解析并返回 ThreeJS 可用的对象。

5. **错误处理**:

   - 如果在加载或解析过程中发生任何错误,加载器会调用 `onError`回调函数。
   - 在这个回调函数中,可以处理错误并进行相应的操作,如记录错误日志、提示用户等。

6. **销毁**:

   - 当加载器不再需要使用时,可以调用 `dispose()`方法来释放相关资源。
   - 这个方法会移除加载器内部使用的事件监听器和其他引用,帮助进行内存管理。

总的来说,加载器的生命周期可以概括为:初始化 -> 加载 -> 进度 -> 解析 -> 错误处理 -> 销毁。开发者可以在这些关键阶段插入自定义的逻辑,以满足不同的需求。
