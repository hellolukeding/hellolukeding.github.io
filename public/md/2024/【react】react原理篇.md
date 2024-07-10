# JSX

> `<></>`->`React.createElement`->`React.Element`->`fiber`
>
> fiber =[child,return ,sibiling] ,sibling 指向兄弟节点

```javascript

```

- 处理数组节点，调用 `const flatChildren = React.Children.toArray(children)`
- **遍历 children ，验证 React.element 元素节点，除去文本节点。**
- 调用 `React.createElement `将元素创建到最后
- 通过 `React.cloneElement` 把 reactElement 复制一份，再用新的 children 属性，从而达到改变 render 结果的目的

# 组件通信

1. props 和 callback 方式
2. ref 方式。
3. React-redux 或 React-mobx 状态管理方式。
4. context 上下文方式。
5. event bus 事件总线。

## 事件总线方式

```javascript
import { BusService } from "./eventBus";
/* event Bus  */
function Son() {
  const [fatherSay, setFatherSay] = useState("");
  React.useEffect(() => {
    BusService.on("fatherSay", (value) => {
      /* 事件绑定 , 给父组件绑定事件 */
      setFatherSay(value);
    });
    return function () {
      BusService.off("fatherSay"); /* 解绑事件 */
    };
  }, []);
  return (
    <div className="son">
      我是子组件
      <div> 父组件对我说：{fatherSay} </div>
      <input
        placeholder="我对父组件说"
        onChange={(e) => BusService.emit("childSay", e.target.value)}
      />
    </div>
  );
}
/* 父组件 */
function Father() {
  const [childSay, setChildSay] = useState("");
  React.useEffect(() => {
    /* 事件绑定 , 给子组件绑定事件 */
    BusService.on("childSay", (value) => {
      setChildSay(value);
    });
    return function () {
      BusService.off("childSay"); /* 解绑事件 */
    };
  }, []);
  return (
    <div className="box father">
      我是父组件
      <div> 子组件对我说：{childSay} </div>
      <input
        placeholder="我对子组件说"
        onChange={(e) => BusService.emit("fatherSay", e.target.value)}
      />
      <Son />
    </div>
  );
}
```

缺点：

- 需要手动绑定和解绑
- 组件状态难以维护
- 违背了单项数据流

# setState 原理

类组件初始化过程中绑定了负责更新的 `Updater`对象，对于如果调用 setState 方法，实际上是 React 底层调用 Updater 对象上的 enqueueSetState 方法。

## enqueueSetState 到底做了些什么

### 类组件中

```javascript
enqueueSetState(){
     /* 每一次调用`setState`，react 都会创建一个 update 里面保存了 */
     const update = createUpdate(expirationTime, suspenseConfig);
     /* callback 可以理解为 setState 回调函数，第二个参数 */
     callback && (update.callback = callback)
     /* enqueueUpdate 把当前的update 传入当前fiber，待更新队列中 */
     enqueueUpdate(fiber, update);
     /* 开始调度更新 */
     scheduleUpdateOnFiber(fiber, expirationTime);
}

```

```javascript
function batchedEventUpdates(fn, a) {
  /* 开启批量更新  */
  isBatchingEventUpdates = true;
  try {
    /* 这里执行了的事件处理函数， 比如在一次点击事件中触发setState,那么它将在这个函数内执行 */
    return batchedEventUpdatesImpl(fn, a, b);
  } finally {
    /* try 里面 return 不会影响 finally 执行  */
    /* 完成一次事件，批量更新  */
    isBatchingEventUpdates = false;
  }
}
```

总结： 在类组件中，每一次更新会初始化一个 update 对象，然后将这个对象传入当前 fiber 中，然后开始调度更新，多次更新会被放置到执行栈中，但是异步操作会进入到一个队列中，使得组件多次更新，可以使用 unstable_batchUpdates 手动批量更新，react.flushSyc 会将它之前遇到的多次更新合并为一次，提升更新的优先级

### 函数组件中的 state

对于 dispatch 的参数,也有两种情况：

- 第一种非函数情况，此时将作为新的值，赋予给 state，作为下一次渲染使用;
- 第二种是函数的情况，如果 dispatch 的参数为一个函数，这里可以称它为 reducer，reducer 参数，是上一次返回最新的 state，返回值作为新的 state。

# 组件声明周期
