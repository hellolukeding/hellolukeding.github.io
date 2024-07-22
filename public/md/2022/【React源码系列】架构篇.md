> ~->react15
>
> - Reconciler（stack 协调器）—— 负责找出变化的组件
> - Renderer（渲染器）—— 负责将变化的组件渲染到页面上

每当有更新发生时，**Reconciler**会做如下工作：

- 调用函数组件、或 class 组件的 `render`方法，将返回的 JSX 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知**Renderer**将变化的虚拟 DOM 渲染到页面上

在每次更新发生时，**Renderer**接到**Reconciler**通知，将变化的组件渲染在当前宿主环境。(跨平台特性：ReactNative,ReactTest,ReactArt)

> 缺点
> reconciler 会调用 mountComponent，updateComponent 递归更新组件，因为递归过程无法中断(中断后，更新队列后的组件无法更新)，因此页面层级过深的情况下页面容易卡顿

> react16->~
>
> - Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入**Reconciler**
> - Reconciler（协调器）—— 负责找出变化的组件
> - Renderer（渲染器）—— 负责将变化的组件渲染到页面上

==Scheduler==
类似于 requestIdleCallback 会在浏览器空闲时候执行一些优先级比较低的工作
缺点：

- 兼容性问题
- 切换 tab 后导致的执行时机混乱
  因此 react 实现了自己的调度器

==Reconciler==
从递归更新组件变成了循环，每次循环会调用 `shouldYeild`判断当前是否有剩余时间，循环后为变化的虚拟 dom 打上标记：

```javascript
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type SideEffectTag = number;

// Don't change these two values. They're used by React Dev Tools.
export const NoEffect = /*                     */ 0b000000000000000;
export const PerformedWork = /*                */ 0b000000000000001;

// You can change the rest (and add more).
export const Placement = /*                    */ 0b000000000000010;
export const Update = /*                       */ 0b000000000000100;
export const PlacementAndUpdate = /*           */ 0b000000000000110;
export const Deletion = /*                     */ 0b000000000001000;
export const ContentReset = /*                 */ 0b000000000010000;
export const Callback = /*                     */ 0b000000000100000;
export const DidCapture = /*                   */ 0b000000001000000;
export const Ref = /*                          */ 0b000000010000000;
export const Snapshot = /*                     */ 0b000000100000000;
export const Passive = /*                      */ 0b000001000000000;
export const PassiveUnmountPendingDev = /*     */ 0b010000000000000;
export const Hydrating = /*                    */ 0b000010000000000;
export const HydratingAndUpdate = /*           */ 0b000010000000100;

// Passive & Update & Callback & Ref & Snapshot
export const LifecycleEffectMask = /*          */ 0b000001110100100;

// Union of all host effects
export const HostEffectMask = /*               */ 0b000011111111111;

// These are not really side effects, but we still reuse this field.
export const Incomplete = /*                   */ 0b000100000000000;
export const ShouldCapture = /*                */ 0b001000000000000;
export const ForceUpdateForLegacySuspense = /* */ 0b100000000000000;

// Union of side effect groupings as pertains to subtreeTag
export const BeforeMutationMask = /*           */ 0b000001100001010;
export const MutationMask = /*                 */ 0b000010010011110;
export const LayoutMask = /*                   */ 0b000000010100100;
```

标记完成后由 render 统一渲染

==fiber 数据结构==

```javascript
function FiberNode(
  tag: WorkTag,

  pendingProps: mixed,

  key: null | string,

  mode: TypeOfMode
) {
  // 作为静态数据结构的属性
  //组件类型
  this.tag = tag;
  //key
  this.key = key;
  //element类型，函数组件，类组件
  this.elementType = null;
  //对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
  this.type = null;
  //真实dom节点
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树

  this.return = null; //一个子级 fiber 指向父级 fiber 的指针

  this.child = null; //一个由父级 fiber 指向子级 fiber 的指针

  this.sibling = null; //一个 fiber 指向下一个兄弟 fiber 的指针

  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性

  this.pendingProps = pendingProps;

  this.memoizedProps = null;

  this.updateQueue = null;

  this.memoizedState = null;

  this.dependencies = null;

  this.mode = mode;

  //保存本次更新会造成的DOM操作

  this.effectTag = NoEffect;

  this.nextEffect = null;

  this.firstEffect = null;

  this.lastEffect = null;

  // 调度优先级相关

  this.lanes = NoLanes;

  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber

  this.alternate = null;
}
```

==fiber 树==
双缓冲技术

### JSX

> 编译过程中 JSX 会被编译成 React.Element 形式，调用 React.CreateElement,转换成 fiber 对象

```javascript
React.createElement(type, [props], [...children]);
```
