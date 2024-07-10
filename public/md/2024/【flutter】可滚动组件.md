# 可滚动组件

Sliver 可以包含一个或多个子组件。Sliver 的主要作用是配合：加载子组件并确定每一个子组件的布局和绘制信息，如果 Sliver 可以包含多个子组件时，通常会实现按需加载模型（类似 web 前端懒加载）。

只有当 Sliver 出现在视口中时才会去构建它，这种模型也称为“基于 Sliver 的列表按需加载模型”。可滚动组件中有很多都支持基于 Sliver 的按需加载模型，如 `ListView`、`GridView`，但是也有不支持该模型的，如 `SingleChildScrollView`。

Flutter 中的可滚动组件主要由三个角色组成：Scrollable、Viewport 和 Sliver：

- Scrollable ：用于处理滑动手势，确定滑动偏移，滑动偏移变化时构建 Viewport 。
- Viewport：显示的视窗，即列表的可视区域；
- Sliver：视窗里显示的元素。

具体布局过程：

1. Scrollable 监听到用户滑动行为后，根据最新的滑动偏移构建 Viewport 。
2. Viewport 将当前视口信息和配置信息通过 SliverConstraints 传递给 Sliver。
3. Sliver 中对子组件（RenderBox）按需进行构建和布局，然后确认自身的位置、绘制等信息，保存在 geometry 中（一个 SliverGeometry 类型的对象）。

## scrollable

```dart
Scrollable({
  ...
  this.axisDirection = AxisDirection.down, //滚动方向
  this.controller, //控制滚动位置，监听滚动效果
  this.physics,// 定义滚动操作的效果
  required this.viewportBuilder, //
})
```

## viewport

```dart
Viewport({
  Key? key,
  this.axisDirection = AxisDirection.down,
  this.crossAxisDirection,
  this.anchor = 0.0,
  required ViewportOffset offset, // 用户的滚动偏移
  // 类型为Key，表示从什么地方开始绘制，默认是第一个元素
  this.center,
  this.cacheExtent, // 预渲染区域
  //该参数用于配合解释cacheExtent的含义，也可以为主轴长度的乘数
  this.cacheExtentStyle = CacheExtentStyle.pixel,
  this.clipBehavior = Clip.hardEdge,
  List<Widget> slivers = const <Widget>[], // 需要显示的 Sliver 列表
})
```
