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
