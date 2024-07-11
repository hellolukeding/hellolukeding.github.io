# 类型

## dynamic 与 Object

`dynamic`是动态类型，即编译器会去推断所有可能出现的组合，从而使得尽可能匹配正确的类型，而 Object 是所有对象的基类

```dart
dynamic test1="";
Object test2="";

print(test1.length);//ac
print(test2.length);//error
```

# 函数

## 函数可选参数

包装一组函数参数，用[]标记为可选的位置参数，并放在参数列表的最后面：

```dart
String say(String from, String msg, [String? device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}
```

## 函数可选命名参数

```dart
//设置[bold]和[hidden]标志
void enableFlags({bool bold, bool hidden}) {
    // ...
}
```

调用

```dart
enableFlags(bold: true, hidden: false);
```

# 类

```dart
class Person {
  say() {
    print('say');
  }
}

mixin Eat {
  eat() {
    print('eat');
  }
}

mixin Walk {
  walk() {
    print('walk');
  }
}

mixin Code {
  code() {
    print('key');
  }
}

class Dog with Eat, Walk{}
class Man extends Person with Eat, Walk, Code{}
```

# 组件

## 无状态组件（StatelessWidget）

```dart
abstract class StatelessWidget extends Widget {
  /// Initializes [key] for subclasses.
  const StatelessWidget({super.key});

  @override
  StatelessElement createElement() => StatelessElement(this);

  @protected
  Widget build(BuildContext context);
}
```

### build 方法

1. **功能** : `build` 方法的主要作用是返回一个 `Widget` 对象,这个 `Widget` 对象就是当前 Widget 在屏幕上的可视化表示。通常这个返回的 `Widget` 会是一个 `StatelessWidget` 或 `StatefulWidget`。
2. **调用时机** : `build` 方法会在以下几种情况下被调用:

- 当 Widget 第一次被添加到 Widget 树中时。
- 当 Widget 的状态发生变化时(对于 `StatefulWidget`)。
- 当 Widget 的父级 Widget 发生变化时,需要重新构建当前 Widget。

1. **参数** : `build` 方法只有一个参数 `BuildContext`。`BuildContext` 是一个用于访问 Widget 树中当前位置的对象,可以用它来获取父级 Widget 的信息,比如主题、样式等。
2. **返回值** : `build` 方法必须返回一个 `Widget` 对象,这个 `Widget` 就是当前 Widget 在屏幕上的可视化表示。通常会返回一个 `StatelessWidget` 或 `StatefulWidget`。
3. **注意事项** :

- `build` 方法应该是 **纯函数** ,意味着它不应该有任何副作用,比如网络请求、状态更新等。这些操作应该放在 Widget 的生命周期方法中进行。
- `build` 方法应该尽可能地简单,复杂的逻辑应该被拆分到其他方法或单独的 Widget 中。
- `build` 方法应该尽量避免使用 `setState()` 方法,因为这会导致重新构建整个 Widget 树,影响性能。

## 状态组件 (StatefulWidget)

状态组件的抽象类

```dart
abstract class StatefulWidget extends Widget {

  const StatefulWidget({super.key});

  @override
  StatefulElement createElement() => StatefulElement(this);

  @protected
  @factory
  State createState();
}
```

因此包含状态组件不仅包括状态组件内容，还包括一个 `state`实例，`state`实例抽象类

```dart
abstract class State<T extends StatefulWidget> with Diagnosticable {

  T get widget => _widget!;
  T? _widget;

  _StateLifecycle _debugLifecycleState = _StateLifecycle.created;

  bool _debugTypesAreRight(Widget widget) => widget is T;

  BuildContext get context {
    assert(() {
      if (_element == null) {
        throw FlutterError(
          'This widget has been unmounted, so the State no longer has a context (and should be considered defunct). \n'
          'Consider canceling any active work during "dispose" or using the "mounted" getter to determine if the State is still active.',
        );
      }
      return true;
    }());
    return _element!;
  }

  StatefulElement? _element;

  bool get mounted => _element != null;

  @protected
  @mustCallSuper
  void initState() {
    assert(_debugLifecycleState == _StateLifecycle.created);
    if (kFlutterMemoryAllocationsEnabled) {
      MemoryAllocations.instance.dispatchObjectCreated(
        library: _flutterWidgetsLibrary,
        className: '$State',
        object: this,
      );
    }
  }

  @mustCallSuper
  @protected
  void didUpdateWidget(covariant T oldWidget) {}

  @protected
  @mustCallSuper
  void reassemble() {}

  @protected
  void setState(VoidCallback fn) {
    assert(() {
      if (_debugLifecycleState == _StateLifecycle.defunct) {
        throw FlutterError.fromParts(<DiagnosticsNode>[
          ErrorSummary('setState() called after dispose(): $this'),
          ErrorDescription(
            'This error happens if you call setState() on a State object for a widget that '
            'no longer appears in the widget tree (e.g., whose parent widget no longer '
            'includes the widget in its build). This error can occur when code calls '
            'setState() from a timer or an animation callback.',
          ),
          ErrorHint(
            'The preferred solution is '
            'to cancel the timer or stop listening to the animation in the dispose() '
            'callback. Another solution is to check the "mounted" property of this '
            'object before calling setState() to ensure the object is still in the '
            'tree.',
          ),
          ErrorHint(
            'This error might indicate a memory leak if setState() is being called '
            'because another object is retaining a reference to this State object '
            'after it has been removed from the tree. To avoid memory leaks, '
            'consider breaking the reference to this object during dispose().',
          ),
        ]);
      }
      if (_debugLifecycleState == _StateLifecycle.created && !mounted) {
        throw FlutterError.fromParts(<DiagnosticsNode>[
          ErrorSummary('setState() called in constructor: $this'),
          ErrorHint(
            'This happens when you call setState() on a State object for a widget that '
            "hasn't been inserted into the widget tree yet. It is not necessary to call "
            'setState() in the constructor, since the state is already assumed to be dirty '
            'when it is initially created.',
          ),
        ]);
      }
      return true;
    }());
    final Object? result = fn() as dynamic;
    assert(() {
      if (result is Future) {
        throw FlutterError.fromParts(<DiagnosticsNode>[
          ErrorSummary('setState() callback argument returned a Future.'),
          ErrorDescription(
            'The setState() method on $this was called with a closure or method that '
            'returned a Future. Maybe it is marked as "async".',
          ),
          ErrorHint(
            'Instead of performing asynchronous work inside a call to setState(), first '
            'execute the work (without updating the widget state), and then synchronously '
            'update the state inside a call to setState().',
          ),
        ]);
      }
      // We ignore other types of return values so that you can do things like:
      //   setState(() => x = 3);
      return true;
    }());
    _element!.markNeedsBuild();
  }

  @protected
  @mustCallSuper
  void deactivate() {}

  @protected
  @mustCallSuper
  void activate() {}

  @protected
  @mustCallSuper
  void dispose() {
    assert(_debugLifecycleState == _StateLifecycle.ready);
    assert(() {
      _debugLifecycleState = _StateLifecycle.defunct;
      return true;
    }());
    if (kFlutterMemoryAllocationsEnabled) {
      MemoryAllocations.instance.dispatchObjectDisposed(object: this);
    }
  }

  @protected
  Widget build(BuildContext context);

  @protected
  @mustCallSuper
  void didChangeDependencies() {}

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    assert(() {
      properties.add(EnumProperty<_StateLifecycle>(
          'lifecycle state', _debugLifecycleState,
          defaultValue: _StateLifecycle.ready));
      return true;
    }());
    properties
        .add(ObjectFlagProperty<T>('_widget', _widget, ifNull: 'no widget'));
    properties.add(ObjectFlagProperty<StatefulElement>('_element', _element,
        ifNull: 'not mounted'));
  }
}

```

[State] 对象具有以下生命周期：

- 框架通过调用 [StatefulWidget.createState] 创建 [State] 对象。
- 新创建的 [State] 对象与 [BuildContext] 相关联。此关联是永久性的：[State] 对象永远不会更改其 [BuildContext]。但是，[BuildContext] 本身可以与其子树一起在树中移动。此时，[State] 对象被视为 [已安装]。
- 框架调用 [initState]。[State] 的子类应重写 [initState] 以执行依赖于 [BuildContext] 或小部件的一次性初始化，当调用 [initState] 方法时，它们分别可用作 [context] 和 [widget] 属性。
- 框架调用 [didChangeDependencies]。 [State] 的子类应该重写 [didChangeDependencies] 来执行涉及 [InheritedWidget] 的初始化。如果调用 [BuildContext.dependOnInheritedWidgetOfExactType]，则如果继承的小部件随后发生变化或小部件在树中移动，将再次调用 [didChangeDependencies] 方法。此时，[State] 对象已完全初始化，框架可能会多次调用其 [build] 方法来获取此子树的用户界面描述。[State] 对象可以通过调用其 [setState] 方法自发请求重建其子树，这表明其某些内部状态已发生更改，可能会影响此子树中的用户界面。在此期间，父窗口小部件可能会重建并请求树中的此位置更新以显示具有相同的 [runtimeType] 和 [Widget.key] 的新窗口小部件。发生这种情况时，框架将更新 [widget] 属性以引用新窗口小部件，然后使用前一个窗口小部件作为参数调用 [didUpdateWidget] 方法。[State] 对象应覆盖 [didUpdateWidget] 以响应其关联窗口小部件中的更改（例如，启动隐式动画）。框架总是在调用 [didUpdateWidget] 之后调用 [build]，这意味着在 [didUpdateWidget] 中对 [setState] 的任何调用都是多余的。 （另请参阅[Element.rebuild] 中的讨论。）

在开发过程中，如果发生热重载（无论是通过按 `r`从命令行 `flutter`工具启动，还是从 IDE 启动），都会调用 [reassemble] 方法。这提供了重新初始化在 [initState] 方法中准备的任何数据的机会。如果包含 [State] 对象的子树从树中删除（例如，因为父级使用不同的 [runtimeType]或 [Widget.key] 构建了小部件），框架将调用 [deactivate] 方法。子类应该重写此方法以清理此对象之间的任何链接与树中的其他元素（例如，如果您为祖先提供了指向后代的 [RenderObject] 的指针）。此时，框架可能会将此子树重新插入树的另一个部分。如果发生这种情况，框架将确保它调用 [build] 以使 [State] 对象有机会适应其在树中的新位置。如果框架确实重新插入了此子树，它将在子树从树中删除的动画帧结束之前执行此操作。因此，[State] 对象可以推迟释放大多数资源，直到框架调用其 [dispose] 方法。如果框架在当前动画帧结束时没有重新插入此子树，则框架将调用 [dispose]，这表明此 [State] 对象将永远不会再次构建。子类应该重写此方法以释放此对象保留的任何资源（例如，停止任何活动动画）。框架调用 [dispose] 后，[State] 对象被视为已卸载，并且 [mounted] 属性为 false。此时调用 [setState] 是错误的。生命周期的这个阶段是终点：无法重新挂载已处置的 [State] 对象。

state 对象生命周期方法:

- **initState()** : 当 State 对象被创建时,会调用这个方法,通常用于执行一些初始化操作。
- **didChangeDependencies()** : 当 State 对象的依赖发生变化时,会调用这个方法。
- **build()** : 与 StatelessWidget 一样,当 State 对象需要重新渲染时,会调用这个方法来返回 Widget 的可视化表示。
- **didUpdateWidget()** : 当 StatefulWidget 的属性发生变化时,会调用这个方法。
- **deactivate()** : 当 State 对象从 Widget 树中被移除时,会调用这个方法。
- **dispose()** : 当 State 对象被销毁时,会调用这个方法,通常用于执行一些清理操作。

# flutter 布局与约束

`flutter`没有和 `ReactNative`走同样的技术路线，RN 是通过 JsCore 将视图层组织起来，渲染过程交给原生 API，而 flutter 是直接调用 GPU，相当于更加底层，因此 flutter 适配能力应该较 RN 更强，上限也更高。

![flutter架构设计图](https://cdn.ipfsscan.io/ipfs/Qmb2q8wtJVW6rmRQ7yuKejn1RvCG8SwAqtMRQ19eamrA66?filename=image.png)

`flutter`有两种布局原理：

- 基于 RenderBox 的盒模型
- 基于 Sliver (Render Sliver)的按需加载列表布局

大体流程如下：

1. 上层组件向下层组件传递约束（constraints）条件。
2. 下层组件确定自己的大小，然后告诉上层组件。注意下层组件的大小必须符合父组件的约束。
3. 上层组件确定下层组件相对于自身的偏移和确定自身的大小（大多数情况下会根据子组件的大小来确定自身的大小）

## BoxConstraints

```dart
const BoxConstraints({
  this.minWidth = 0.0, //最小宽度
  this.maxWidth = double.infinity, //最大宽度
  this.minHeight = 0.0, //最小高度
  this.maxHeight = double.infinity //最大高度
})

```

用于约束子组件大小，和子组件尺寸做交集。

## ConstrainedBox

`ConstrainedBox`用于对子组件添加额外的约束。例如，如果你想让子组件的最小高度是 80 像素，你可以使用 `const BoxConstraints(minHeight: 80.0)`作为子组件的约束。

```dart
Widget redBox = DecoratedBox(
  decoration: BoxDecoration(color: Colors.red),
);
//实现高度为50,宽度为无限大的容器
ConstrainedBox(
  constraints: BoxConstraints(
    minWidth: double.infinity, //宽度尽可能大
    minHeight: 50.0 //最小高度为50像素
  ),
  child: Container(
    height: 5.0,
    child: redBox ,
  ),
)
```

> `针对多重限制取父子约束范围中值最大的`

## UncontraintedBox

> 父组件不做约束，即根据子组件向上一层层确定大小()

```dart
ConstrainedBox(
  constraints: BoxConstraints(minWidth: 60.0, minHeight: 100.0),  //父
  child: UnconstrainedBox( //“去除”父级限制
    child: ConstrainedBox(
      constraints: BoxConstraints(minWidth: 90.0, minHeight: 20.0),//子
      child: redBox,
    ),
  )
)

```

# 常规布局

## 布局限制的核心思想

- 上层组件只传递限制条件
- 子组件向上层传递位置与大小（相对于父组件）
- 父组件决定子组件的位置

## 线性布局（Row 和 Column）

```dart
Row({
  ...
  TextDirection textDirection,
  MainAxisSize mainAxisSize = MainAxisSize.max,
  MainAxisAlignment mainAxisAlignment = MainAxisAlignment.start,
  VerticalDirection verticalDirection = VerticalDirection.down,
  CrossAxisAlignment crossAxisAlignment = CrossAxisAlignment.center,
  List<Widget> children = const <Widget>[],
})
```

- `textDirection`：表示水平方向子组件的布局顺序(是从左往右还是从右往左)，默认为系统当前 Locale 环境的文本方向(如中文、英语都是从左往右，而阿拉伯语是从右往左)。
- `mainAxisSize`：表示 `Row`在主轴(水平)方向占用的空间，默认是 `MainAxisSize.max`，表示尽可能多的占用水平方向的空间，此时无论子 widgets 实际占用多少水平空间，`Row`的宽度始终等于水平方向的最大宽度；而 `MainAxisSize.min`表示尽可能少的占用水平空间，当子组件没有占满水平剩余空间，则 `Row`的实际宽度等于所有子组件占用的水平空间；
- `mainAxisAlignment`：表示子组件在 `Row`所占用的水平空间内对齐方式，如果 `mainAxisSize`值为 `MainAxisSize.min`，则此属性无意义，因为子组件的宽度等于 `Row`的宽度。只有当 `mainAxisSize`的值为 `MainAxisSize.max`时，此属性才有意义，`MainAxisAlignment.start`表示沿 `textDirection`的初始方向对齐，如 `textDirection`取值为 `TextDirection.ltr`时，则 `MainAxisAlignment.start`表示左对齐，`textDirection`取值为 `TextDirection.rtl`时表示从右对齐。而 `MainAxisAlignment.end`和 `MainAxisAlignment.start`正好相反；`MainAxisAlignment.center`表示居中对齐。读者可以这么理解：`textDirection`是 `mainAxisAlignment`的参考系。
- `verticalDirection`：表示 `Row`纵轴（垂直）的对齐方向，默认是 `VerticalDirection.down`，表示从上到下。
- `crossAxisAlignment`：表示子组件在纵轴方向的对齐方式，`Row`的高度等于子组件中最高的子元素高度，它的取值和 `MainAxisAlignment`一样(包含 `start`、`end`、 `center`三个值)，不同的是 `crossAxisAlignment`的参考系是 `verticalDirection`，即 `verticalDirection`值为 `VerticalDirection.down`时 `crossAxisAlignment.start`指顶部对齐，`verticalDirection`值为 `VerticalDirection.up`时，`crossAxisAlignment.start`指底部对齐；而 `crossAxisAlignment.end`和 `crossAxisAlignment.start`正好相反；
- `children` ：子组件数组。

## 弹性布局

```dart
Flex({
  ...
  required this.direction, //弹性布局的方向, Row默认为水平方向，Column默认为垂直方向
  List<Widget> children = const <Widget>[],
})
```

`row`和 `column`都继承自 flex

```dart
const Expanded({
  int flex = 1,
  required Widget child,
})
```

flex 是弹性系数，同 css 中作用，`Expanded`只能用作 flex 的子组件

## 流式布局

```dart
Wrap({
  ...
  this.direction = Axis.horizontal,
  this.alignment = WrapAlignment.start,
  this.spacing = 0.0, //主轴方向上子widget的间距
  this.runAlignment = WrapAlignment.start,//纵轴方向上的对齐方式
  this.runSpacing = 0.0, //纵轴方向上的间距
  this.crossAxisAlignment = WrapCrossAlignment.start,
  this.textDirection,
  this.verticalDirection = VerticalDirection.down,
  List<Widget> children = const <Widget>[],
})
```

flow...

## 层叠布局

层叠布局和 Web 中的绝对定位、Android 中的 Frame 布局是相似的，子组件可以根据距父容器四个角的位置来确定自身的位置。层叠布局允许子组件按照代码中声明的顺序堆叠起来。Flutter 中使用 `Stack`和 `Positioned`这两个组件来配合实现绝对定位。`Stack`允许子组件堆叠，而 `Positioned`用于根据 `Stack`的四个角来确定子组件的位置。

```dart
Stack(
  alignment:Alignment.center ,
  fit: StackFit.expand, //未定位widget占满Stack整个空间
  children: <Widget>[
    Positioned(
      left: 18.0,
      child: Text("I am Jack"),
    ),
    Container(child: Text("Hello world",style: TextStyle(color: Colors.white)),
      color: Colors.red,
    ),
    Positioned(
      top: 18.0,
      child: Text("Your friend"),
    )
  ],
),
```

# 容器类组件

### 装饰组件（DecoratedBox + BoxDecoration）

```dart
//DecoratedBox
const DecoratedBox({
  Decoration decoration,
  DecorationPosition position = DecorationPosition.background,
  Widget? child
})
//BoxDecoration
BoxDecoration({
  Color color, //颜色
  DecorationImage image,//图片
  BoxBorder border, //边框
  BorderRadiusGeometry borderRadius, //圆角
  List<BoxShadow> boxShadow, //阴影,可以指定多个
  Gradient gradient, //渐变
  BlendMode backgroundBlendMode, //背景混合模式
  BoxShape shape = BoxShape.rectangle, //形状
})
```

# 滚动组件 （RenderSliver）

> sliver(薄片),性能优化，当组件到达视口后才开始渲染

可滚动组件三个要素

- Scrollable ：用于处理滑动手势，确定滑动偏移，滑动偏移变化时构建 Viewport 。
- Viewport：显示的视窗，即列表的可视区域；
- Sliver：视窗里显示的元素。

具体布局过程：

1. Scrollable 监听到用户滑动行为后，根据最新的滑动偏移构建 Viewport 。
2. Viewport 将当前视口信息和配置信息通过 SliverConstraints 传递给 Sliver。
3. Sliver 中对子组件（RenderBox）按需进行构建和布局，然后确认自身的位置、绘制等信息，保存在 geometry 中（一个 SliverGeometry 类型的对象）。

## Scrollable

> 处理滑动手势，确定滑动偏移，滑动偏移变化时重新构建 viewport

```dart
Scrollable({
  ...
  this.axisDirection = AxisDirection.down, //滚动方向
  this.controller, //scrollController对象，控制滚动位置和监听滚动事件
  this.physics, //ScrollPhysics 对象，决定了可滚动组件如何响应用户的操作
  required this.viewportBuilder, // 构建viewPort的回调
})
```

## Viewport

> 用于显示在视口中的 `sliver`

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

cacheExtent 和 cacheExtentStyle：CacheExtentStyle 是一个枚举，有 pixel 和 viewport 两个取值。当 cacheExtentStyle 值为 pixel 时，cacheExtent 的值为预渲染区域的具体像素长度；当值为 viewport 时，cacheExtent 的值是一个乘数，表示有几个 viewport 的长度，最终的预渲染区域的像素长度为：cacheExtent \* viewport 的积， 这在每一个列表项都占满整个 Viewport 时比较实用，这时 cacheExtent 的值就表示前后各缓存几个页面。

## sliver
