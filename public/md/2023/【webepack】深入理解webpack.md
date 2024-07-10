# Mini-Webpack

## 概念

### entry

入口起点(entry point)指示 webpack 应该使用哪个模块,来作为构建其内部依赖图的开始。进入入口起点后,webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。每个依赖项随即被处理,最后输出到称之为 bundles 的文件中。

### output

output 属性告诉 webpack 在哪里输出它所创建的 bundles,以及如何命名这些文件,默认值为 ./dist。

### module

模块,在 Webpack 里一切皆模块,一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块。

### chunk

代码块,一个 Chunk 由多个模块组合而成,用于代码合并与分割。

### loader

loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块,然后你就可以利用 webpack 的打包能力,对它们进行处理。本质上,webpack loader 将所有类型的文件,转换为应用程序的依赖图（和最终的 bundle）可以直接引用的模块。

### plugin

loader 被用于转换某些类型的模块,而插件则可以用于执行范围更广的任务。插件的范围包括,从打包优化和压缩,一直到重新定义环境中的变量。插件接口功能极其强大,可以用来处理各种各样的任务。

## webpack 构建流程

Webpack 的运行流程是一个串行的过程,从启动到结束会依次执行以下流程 :

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数。
2. 开始编译：用上一步得到的参数初始化 Compiler 对象,加载所有配置的插件,执行对象的 run 方法开始执行编译。
3. 确定入口：根据配置中的 entry 找出所有的入口文件。
4. 编译模块：从入口文件出发,调用所有配置的 Loader 对模块进行翻译,再找出该模块依赖的模块,再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理。
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后,得到了每个模块被翻译后的最终内容以及它们之间的依赖关系。
6. 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk,再把每个 Chunk 转换成一个单独的文件加入到输出列表,这步是可以修改输出内容的最后机会。
7. 输出完成：在确定好输出内容后,根据配置确定输出的路径和文件名,把文件内容写入到文件系统。

## webpack 单文件打包

> ```javascript
> // src/single/index.js
> var index2 = require("./index2");
> var util = require("./util");
> console.log(index2);
> console.log(util);
>
> // src/single/index2.js
> var util = require("./util");
> console.log(util);
> module.exports = "index 2";
>
> // src/single/util.js
> module.exports = "Hello World";
>
> // 通过 config/webpack.config.single.js 打包
> const webpack = require("webpack");
> const path = require("path");
>
> module.exports = {
>   entry: {
>     index: [path.resolve(__dirname, "../src/single/index.js")],
>   },
>   output: {
>     path: path.resolve(__dirname, "../dist"),
>     filename: "[name].[chunkhash:8].js",
>   },
> };
> ```

打包过程会创建一个空对象 `installedModules={}`,加载一个文件就写入一次

```javascript
var module = (installedModules[moduleId] = {
  i: moduleId,
  l: false,
  exports: {},
});
//注意指针变化
modules[moduleId].call(
  module.exports,
  module,
  module.exports,
  __webpack_require__
);
module.l = true;
```

1. 每个模块 webpack 只会加载一次,所以重复加载的模块只会执行一次，加载过的模块会放到 installedModules，下次需要需要该模块的值就直接从里面拿了。
2. 模块的 id 直接通过数组下标去一一对应的，这样能保证简单且唯一，通过其它方式比如文件名或文件路径的方式就比较麻烦，因为文件名可能出现重名，不唯一，文件路径则会增大文件体积，并且将路径暴露给前端，不够安全。
3. `modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)` 保证了模块加载时 this 的指向 module.exports 并且传入默认参数

## webpack 多文件代码分割

借助 webpack 内置的插件 CommonsChunkPlugin。

```javascript
new webpack.optimize.CommonsChunkPlugin({
  name: "vendor",
  minChunks: 2,
});
```

这段代码的含义是，在这些入口文件中，找到那些引用两次的模块(如：utilB)，帮我抽离成一个叫 vendor 文件，此时那部分初始化工作的代码会被抽离到 vendor 文件中。使用 installedChunks 来保存每个 chunkId 是否被加载过，如果被加载过，则说明该 chunk 中所包含的模块已经被放到了 modules 中，注意是 modules 而不是 installedModules。

```javascript
// vendor.xxxx.js
webpackJsonp([3, 4], {
  3: function (module, exports) {
    module.exports = "util B";
  },
});
```

```javascript
var moduleId,
  chunkId,
  i = 0,
  callbacks = [];
for (; i < chunkIds.length; i++) {
  chunkId = chunkIds[i];
  if (installedChunks[chunkId])
    callbacks.push.apply(callbacks, installedChunks[chunkId]);
  installedChunks[chunkId] = 0;
}
for (moduleId in moreModules) {
  if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
    modules[moduleId] = moreModules[moduleId];
  }
}
while (callbacks.length) callbacks.shift().call(null, __webpack_require__);
if (moreModules[0]) {
  installedModules[0] = 0;
  return __webpack_require__(0);
}
```

简单说说 `webpackJsonpCallback` 做了哪些事，首先判断 chunkIds 在 installedChunks 里有没有回调函数函数未执行完，有的话则放到 callbacks 里，并且等下统一执行，并将 chunkIds 在 installedChunks 中全部置为 0, 然后将 moreModules 合并到 modules。

这里面只有 modules[0] 是不固定的，其它 modules 下标都是唯一的，在打包的时候 webpack 已经为它们统一编号，而 0 则为入口文件即 pageA，pageB 各有一个 module[0]。

然后将 callbacks 执行并清空，保证了该模块加载开始前所以前置依赖内容已经加载完毕，最后判断 moreModules[0], 有值说明该文件为入口文件，则开始执行入口模块 0。

## 异步加载 JS 脚本

```javascript
// 异步加载函数挂载在 __webpack_require__.e 上
__webpack_require__.e = function requireEnsure(chunkId, callback) {
  if (installedChunks[chunkId] === 0)
    return callback.call(null, __webpack_require__);

  if (installedChunks[chunkId] !== undefined) {
    installedChunks[chunkId].push(callback);
  } else {
    installedChunks[chunkId] = [callback];
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;

    script.src =
      __webpack_require__.p +
      "" +
      chunkId +
      "." +
      ({ 0: "pageA", 1: "pageB", 3: "vendor" }[chunkId] || chunkId) +
      "." +
      { 0: "e72ce7d4", 1: "69f6bbe3", 2: "9adbbaa0", 3: "53fa02a7" }[chunkId] +
      ".js";
    head.appendChild(script);
  }
};
```

大致分为三种情况，(已经加载过，正在加载中以及从未加载过)

1. 已经加载过该 chunk 文件，那就不用再重新加载该 chunk 了，直接执行回调函数即可，可以理解为假如页面有两种操作需要加载加载异步脚本，但是两个脚本都依赖于公共模块，那么第二次加载的时候发现之前第一次操作已经加载过了该 chunk，则不用再去获取异步脚本了，因为该公共模块已经被执行过了。
2. 从未加载过，则动态地去插入 script 脚本去请求 js 文件，这也就为什么取名 webpackJsonpCallback，因为跟 jsonp 的思想很类似，所以这种异步加载脚本在做脚本错误监控时经常出现 Script error
3. 正在加载中代表该 chunk 文件已经在加载中了，比如说点击按钮触发异步脚本，用户点太快了，连点两次就可能出现这种情况，此时将回调函数放入 installedChunks。

## tree shaking

什么是 tree shaking，即 webpack 在打包的过程中会将没用的代码进行清除(dead code)。一般 dead code 具有一下的特征：

1. 代码不会被执行，不可到达
2. 代码执行的结果不会被用到
3. 代码只会影响死变量（只写不读）

首先，模块引入要基于 ES6 模块机制，不再使用 commonjs 规范，因为 es6 模块的依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，然后清除没用的代码。而 commonjs 的依赖关系是要到运行时候才能确定下来的。

其次，需要开启 UglifyJsPlugin 这个插件对代码进行压缩。

Webpack 的 tree shaking 实现原理主要是通过以下步骤：

1. 解析：Webpack 通过解析器（如 acorn）解析代码，生成抽象语法树（AST）。
2. 标记：Webpack 根据 AST，标记所有的 ES6 模块导入和导出。
3. 分析：Webpack 分析标记的结果，确定哪些模块被使用，哪些没有被使用。
4. 剔除：Webpack 在生成最终的 bundle 时，剔除没有被使用的模块。

**引入但是没用的变量，函数都会清除，未执行的代码也会被清除。但是类方法是不会被清除的。因为 webpack 不会区分不了是定义在 classC 的 prototype 还是其它 Array 的 prototype 的**

## scope hoisting

scope hoisting，顾名思义就是将模块的作用域提升，在 webpack 中不能将所有所有的模块直接放在同一个作用域下，有以下几个原因：

1. 按需加载的模块
2. 使用 commonjs 规范的模块
3. 被多 entry 共享的模块

在 webpack3 中，这些情况生成的模块不会进行作用域提升，下面我就举个例子来说明：

```js
// src/hoist/utilA.js
export const utilA = "util A";
export function funcA() {
  console.log("func A");
}

// src/hoist/utilB.js
export const utilB = "util B";
export function funcB() {
  console.log("func B");
}

// src/hoist/utilC.js
export const utilC = "util C";

// src/hoist/pageA.js
import { utilA, funcA } from "./utilA";
console.log(utilA);
funcA();

// src/hoist/pageB.js
import { utilA } from "./utilA";
import { utilB, funcB } from "./utilB";

funcB();
import("./utilC").then(function (utilC) {
  console.log(utilC);
});
```

这个例子比较典型，utilA 被 pageA 和 pageB 所共享，utilB 被 pageB 单独加载，utilC 被 pageB 异步加载。

想要 webpack3 生效，则需要在 plugins 中添加 ModuleConcatenationPlugin。

webpack 配置如下：

```js
const webpack = require("webpack");
const path = require("path");
module.exports = {
  entry: {
    pageA: path.resolve(__dirname, "../src/hoist/pageA.js"),
    pageB: path.resolve(__dirname, "../src/hoist/pageB.js"),
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[chunkhash:8].js",
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: 2,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity,
    }),
  ],
};
```

运行 `npm run build:hoist` 进行编译，简单看下生成的 pageB 代码：

```js
webpackJsonp(
  [2],
  {
    2: function (module, __webpack_exports__, __webpack_require__) {
      "use strict";
      var utilA = __webpack_require__(0);
      // CONCATENATED MODULE: ./src/hoist/utilB.js
      const utilB = "util B";
      function funcB() {
        console.log("func B");
      }
      // CONCATENATED MODULE: ./src/hoist/pageB.js
      funcB();
      __webpack_require__
        .e(/* import() */ 0)
        .then(__webpack_require__.bind(null, 3))
        .then(function (utilC) {
          console.log(utilC);
        });
    },
  },
  [2]
);
```

通过代码分析，可以得出下面的结论：

1. 因为我们配置了共享模块抽离，所以 utilA 被抽出为单独模块，故这部分内容不会进行作用域提升。
2. utilB 无牵无挂，被 pageB 单独加载，所以这部分不会生成新的模块，而是直接作用域提升到 pageB 中。
3. utilC 被异步加载，需要抽离成单独模块，很明显没办法作用域提升。

## 大型项目 webpack 优化

### 区分生产环境和开发环境

1. 开发环境：
   - 值得去配置的：
     - 优化开发体验
     - 尽可能减少构建时间
   - 不值得去配置的：
     - 代码丑化
     - 模块拆包，持久化缓存
     - 减少打包文件大小
2. 生产环境：
   - 值得去配置的：
     - 模块拆包，持久化缓存
     - 尽可能减少打包文件大小
     - 代码丑化压缩
     - 尽可能减少构建时间
   - 不值得去配置的：
     - 优化开发体验
     - 开发环境才需要的配置

#### 开发过程

### 优化开发体验

#### 自动刷新 -> 模块热更新：

1. 实时预览反应更快，等待时间更短
2. 不刷新浏览器能保留当前网页的运行状态

想开启热更新，首先需要在入口文件进行配置：

```js
// 入口文件
if (module.hot) {
  module.hot.accept(["./App"], () => {
    render(<App />, document.getElementById("app"));
  });
}
```

模块热更新机制：

1. 当子模块发生更新时，更新事件会一层层往上传递，也就是从 App.js 文件传递到 main.js 文件， 直到有某层的文件接受了当前变化的模块，也就是 main.js 文件中定义的 module.hot.accept(['./App'], callback)， 这时就会调用 callback 函数去执行自定义逻辑。
2. 如果事件一直往上抛到最外层都没有文件接受它，就会直接刷新网页。

Webpack 的热模块替换（Hot Module Replacement，HMR）是一种功能，它可以在应用程序运行时替换、添加或删除模块，而无需进行完全刷新。这个过程是通过以下步骤实现的：

1. 当源代码发生变化时，Webpack 会重新编译修改的模块，然后生成一个新的模块版本。
2. Webpack 通过 WebSocket 连接将新的模块版本发送到浏览器端的 HMR 运行时。
3. HMR 运行时接收到新的模块版本后，会使用这个新的模块版本替换旧的模块。
4. 如果模块的热替换处理函数（通常是 module.hot.accept 函数）存在，HMR 运行时会调用这个函数，通知应用程序模块已经更新。
5. 应用程序在热替换处理函数中可以决定如何处理模块的更新。例如，如果是一个 React 组件，应用程序可以重新渲染这个组件，从而使页面显示新的内容。

最简单的方式：

直接在命令里面加上 `webpack-dev-server --hot` 即可开启热更新。

该参数相当于是做了：

```js
const HotModuleReplacementPlugin = require("webpack/lib/HotModuleReplacementPlugin");
module.exports = {
  plugins: [new HotModuleReplacementPlugin()],
  devServer: {
    hot: true,
  },
};
```

当然如果你想要更加定制化的控制，你需要在 webpack 配置进行额外配置：

```js
const HotModuleReplacementPlugin = require("webpack/lib/HotModuleReplacementPlugin");
module.exports = webpackMerge(baseConfig, {
  plugins: [new HotModuleReplacementPlugin()],
  devServer: {
    // 每次构建时候自动打开浏览器并访问网址
    open: true,
    // 开启热更新
    hot: true,
    // 设置静态资源地址如：/public，从这获取你想要的一些外链资源，图片。
    contentBase: DIST_PATH,
    // 设置端口号
    port: 9000,
    // 将热更新代码注入到模块中
    inline: true,
    // 如果你希望服务器外部可访问
    host: "0.0.0.0",
    // 设置 proxy 代理
    proxy: {
      context: ["/api"],
      target: "//www.proxy.com",
      pathRewrite: { "^/api": "" },
    },
    // 设置 https
    https: true,
  },
});
```

#### 减少构建时间

在大型应用减少每次构建的时间十分重要，动不动几十秒的编译时间令人发指，我在经过一些实践，总结下面一些方式，至少可以让你的编译速度快 1-2 倍。

1. 减小模块查找范围，缩小 Babel 的编译范围，并使用 webpack cache 缓存模块。
2. 使用 DLLPlugin 预先打包好第三方库。
3. 使用 Happypack 加速构建
4. 不用使用 webpack css 模块化方案

首先第一点：缩小 Babel 的编译范围，并使用 webpack cache 缓存模块。

```js
module.exports = {
  // 减小模块的查找范围
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {
            loader: "babel-loader",
            query: {
              // 将 babel 编译过的模块缓存在 webpack_cache 目录下，下次优先复用
              cacheDirectory: "./webpack_cache/",
            },
          },
        ],
        // 减少 babel 编译范围，忘记设置会让 webpack 编译慢上好几倍
        include: path.resolve(__dirname, "src"),
      },
    ],
  },
};
```

通过这步可以快上好几秒，另外你可以使用 DLLPlugin 预先打包好第三方库，避免每次都要去编译。开启 DLLPlugin 需要你额外配置一份 webpack 配置。

```js
// dll.config.js
const webpack = require("webpack");
const path = require("path");
const DllPlugin = require("webpack/lib/DllPlugin");
const vendors = [
  "react",
  "react-dom",
  "react-router",
  "redux",
  "react-redux",
  "jquery",
  "antd",
  "lodash",
];
module.exports = {
  entry: {
    dll: vendors,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public"),
    library: "__[name]__lib",
  },
  plugins: [
    new DllPlugin({
      name: "__[name]__lib",
      path: path.join(__dirname, "build", "[name].manifest.json"),
    }),
  ],
};
```

运行则会在 public 目录下得到 `dll.js` 和 `dll.manifest.json` 文件，然后需要在开发配置文件中关联。

```js
const webpack = require("webpack");

module.exports = webpackMerge(baseConfig, {
  plugins: [
    new DllReferencePlugin({
      manifest: require("./public/dll.manifest.json"),
    }),
  ],
});
```

另外需要在你的 html 模板里面引入 dll.js，webpack 不会自动帮你引入，用好这一步编译速度应该能快一倍左右的时间。

第三点就是使用 happypack 开启多核构建，webpack 之所以慢，是因为由于有大量文件需要解析和处理，构建是文件读写和计算密集型的操作，特别是当文件数量变多后，webpack 构建慢的问题会显得严重。 也就是说 Webpack 需要处理的任务需要一件件挨着做，不能多个事情一起做。

在整个 webpack 构建流程中，最耗时的流程可能就是 loader 对文件的转换操作了，因为要转换的文件数据巨多，而且这些转换操作都只能一个个挨着处理。 Happypack 的核心原理就是把这部分任务分解到多个进程去并行处理，从而减少了总的构建时间。

需要配置哪些 loader 使用 Happypack 就要改写那些配置，比如你想要修改 babel 为多核编译:

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: ["happypack/loader?id=babel"],
        include: path.resolve(__dirname, "src"),
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: "babel",
      loaders: [
        {
          loader: "babel-loader",
          query: {
            cacheDirectory: "./webpack_cache/",
          },
        },
      ],
    }),
  ],
};
```

设置 `id=babel`，webpack 会去找 plugins 中的 id 为 babel 的插件进行处理。配置其它的 loader 的方式也是类似，不过需要注意的是有的 loader 不支持多核编译。通过这一步应该至少能让你的编译速度快 1/3。

最后一点是不要使用 webpack 里 css 模块化方案，我这里指的模块化指的是 css-loader 提供的模块化方式，我们先来看下它是怎么做的，首先它需要在你的 loader 中进行额外配置。

```js
module.exports = webpackMerge(baseConfig, {
  module: {
    rules: [
      {
        test: /\.css/,
        use:       [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // 开启 css 模块
              modules: true,
              // 设置命名格式
              localIdentName: '[name]__[hash:base64:5]'
            }
          }
        ]
      },
    ]
  },
}
```

如果通过这种 css 模块化的方式，意味着你在写 React 组件的时候，需要这样去设置：

```js
import styles from "./index.css";

class Index extends React.Component {
  render() {
    return (
      <div className={styles.recursive}>
        xxxx
        <h1 className={styles.header}></h1>
      </div>
    );
  }
}
export default Index;
```

它相当于是在输出 css 文件的时候做了一层原名称到新名称的一次转化来保证 css 模块化的特性，输出的值就像这样：

```
Object {
  recursive: 'recursive__abc53xxxx',
  xxxxx: 'xxxxx__def884xxx',
}
```

这样做不好的点在哪：

1. 类名只能以驼峰式的形式出现，且每个类名需要额外添加到 React 组件当中
2. 编译速度慢的坑爹，如果你的应用中有大量的样式(数以万计)需要去解析，编译的时间至少增加一倍以上。

所以如果想要使用 css 模块化的可以尽量选择其它方案，比如 styledComponents 或者自己添加命名空间等等。

#### 发布上线

##### 高效利用浏览器缓存

1. 在多页面应用中，我们需要将公共模块进行拆包，比如 header，footer，以及一些公共区域等等，这样页面在我们的网站中进行跳转的时候由于这些公共模块存在于缓存当中，就可以直接进行加载，而不是再通过网络请求。
2. 分离业务代码和第三方的代码：之所以将业务代码和第三方代码分离出来，是因为业务代码更新频率高，而第三方代码更新迭代速度慢，所以我们将第三方代码(库，框架)进行抽离，这样可以充分利用浏览器的缓存来加载第三方库。
3. 从 js 中抽离 css，使得 css 样式和 js 逻辑相对独立，这样我们在修改样式或者页面的逻辑的时候它们将互不影响到各自的缓存。
4. 抽离异步加载的内容，比如路由切割，与首屏渲染无关的内容等等。
5. 生成稳定的 hash 值，代码修改实现 hash 值变化最小，即代码修改只影响到其对应的文件 hash 值，而不要去影响到其它文件的 hash 值。

##### 减小打包体积

- tree shaking
- scope hoisting

##### 压缩代码

##### 输入分析（确定下一步打包思路）
