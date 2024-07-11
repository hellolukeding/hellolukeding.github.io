# StateFullWidget 生命周期

1. **constructor** ：构造函数，用于创建 `State`对象。
2. **initState** ：当 `State`对象被创建并插入到树中时调用，用于初始化数据。
3. **didChangeDependencies** ：当 `State`对象的依赖关系发生变化时调用，例如，在 `initState`之后和 `build`方法之前。
4. **build** ：用于构建 `Widget`，会在 `initState`、`setState`、`didUpdateWidget`、`didChangeDependencies`之后被调用。
5. **didUpdateWidget** ：当 `Widget`配置发生变化时调用，例如，父 `Widget`重建并请求更新该 `Widget`。
6. **deactivate** ：当 `State`对象从树中被移除时调用。
7. **dispose** ：当 `State`对象被永久移除时调用，用于释放资源。

```dart

import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  @override
  void initState() {
    super.initState();
    print('initState');
    // 初始化状态
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print('didChangeDependencies');
    // 当依赖关系发生变化时
  }

  @override
  void didUpdateWidget(MyHomePage oldWidget) {
    super.didUpdateWidget(oldWidget);
    print('didUpdateWidget');
    // 当Widget配置发生变化时
  }

  @override
  Widget build(BuildContext context) {
    print('build');
    return Scaffold(
      appBar: AppBar(
        title: Text('StatefulWidget Lifecycle'),
      ),
      body: Center(
        child: Text('Counter: $_counter'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          setState(() {
            _counter++;
          });
        },
        tooltip: 'Increment',
        child: Icon(Icons.add),
      ),
    );
  }

  @override
  void deactivate() {
    super.deactivate();
    print('deactivate');
    // 当State对象从树中被移除时
  }

  @override
  void dispose() {
    super.dispose();
    print('dispose');
    // 释放资源
  }
}
```
