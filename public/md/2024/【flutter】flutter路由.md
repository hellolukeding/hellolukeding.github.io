# flutter 路由

## 路由定义

> 静态路由是 `MaterialApp`提供的一个 `API`，`routes`是一个 `Map`对象，`key`是调用页面的唯一标识符,`value`是 `widget`

```dart

   void main() {
     runApp(
       MaterialApp(
         home: Page2(),
         routes: {
           'page1': (_) => Page1(),
           'page2': (_) => Page2()
         },
), );
}
   class Page1 extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
       return ContactWidget();
     }
}
   class Page2 extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
       return HomeScreen();
     }
}
```

> 页面跳转

```dart
//需要提前定义
Navigator.of(context).pushNamed('page1');
//不需要提前定义
Navigator.push(context,MaterialPageRoute(builder: (context) => PokemonDetail(pokemon: poke,),),);
```

## 路由传值

```dart
// 下级页面
class TipRoute extends StatelessWidget {
  TipRoute({
    Key key,
    required this.text,  // 接收一个text参数
  }) : super(key: key);
  final String text;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("提示"),
      ),
      body: Padding(
        padding: EdgeInsets.all(18),
        child: Center(
          child: Column(
            children: <Widget>[
              Text(text),
              ElevatedButton(
                onPressed: () => Navigator.pop(context, "我是返回值"), //route 栈弹出当前页面
                child: Text("返回"),
              )
            ],
          ),
        ),
      ),
    );
  }
}

//上级页面
class RouterTestRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElevatedButton(
        onPressed: () async {
          // 打开`TipRoute`，并等待返回结果
          var result = await Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) {
                return TipRoute(
                  // 路由参数
                  text: "我是提示xxxx",
                );
              },
            ),
          );
          //输出`TipRoute`路由返回结果
          print("路由返回值: $result");
        },
        child: Text("打开提示页"),
      ),
    );
  }
}
```

## 命名路由参数传递

### 注册路由

```dart
 routes:{
   "new_page":(context) => EchoRoute(),
  } ,
```

### 接受路由参数

```dart
class EchoRoute extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    //获取路由参数
    var args=ModalRoute.of(context).settings.arguments;
    //...省略无关代码
  }
}
```

### 传递路由参数

```dart
//方式一
Navigator.of(context).pushNamed("new_page", arguments: "hi");
//方式二
MaterialApp(
  ... //省略无关代码
  routes: {
   "tip2": (context){
     return TipRoute(text: ModalRoute.of(context)!.settings.arguments);
   },
 },
);
```

## 动态生成路由

`MaterialApp`有一个 `onGenerateRoute`属性，它在打开命名路由时可能会被调用，之所以说可能，是因为当调用 `Navigator.pushNamed(...)`打开命名路由时，如果指定的路由名在路由表中已注册，则会调用路由表中的 `builder`函数来生成路由组件；如果路由表中没有注册，才会调用 `onGenerateRoute`来生成路由。

```dart
MaterialApp(
  ... //省略无关代码
  onGenerateRoute:(RouteSettings settings){
	  return MaterialPageRoute(builder: (context){
		   String routeName = settings.name;
       // 如果访问的路由页需要登录，但当前未登录，则直接返回登录页路由，
       // 引导用户登录；其他情况则正常打开路由。
     }
   );
  }
);
```

## 子路由

```dart
//使用 Navigator 和 MaterialPageRoute 来实现路由导航。
//创建两个页面类,分别实现公共部分和各自独有的部分。
//在公共部分的页面类中,使用 Navigator.push() 方法来跳转到各自独有的部分。

import 'package:flutter/material.dart';

// 公共部分页面
class CommonPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Common Page'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            // 跳转到独有部分页面
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => UniquePageA()),
            );
          },
          child: Text('Go to Unique Page A'),
        ),
      ),
    );
  }
}

// 独有部分页面A
class UniquePageA extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Unique Page A'),
      ),
      body: Center(
        child: Text('This is Unique Page A'),
      ),
    );
  }
}

// 独有部分页面B
class UniquePageB extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Unique Page B'),
      ),
      body: Center(
        child: Text('This is Unique Page B'),
      ),
    );
  }
}

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      home: CommonPage(),
    );
  }
}
```
