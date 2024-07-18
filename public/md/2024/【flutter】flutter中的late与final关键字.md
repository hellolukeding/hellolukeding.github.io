# flutt中的`late`与`final`关键字

**final**



​	•	**定义**：final 关键字用于定义一个只能被赋值一次的变量。一旦赋值，变量的值就不能再改变。

​	•	**使用场景**：适用于那些在初始化时就能确定值的变量，且不需要再改变。

​	•	**示例**：

```dart
final String name = "Flutter";
```

**late**



​	•	**定义**：late 关键字用于定义一个在稍后才会被初始化的变量。它推迟了变量的初始化，允许在稍后阶段赋值。

​	•	**使用场景**：适用于那些需要稍后初始化的变量，特别是在构造函数或异步操作中。使用 late 关键字时，要确保在使用变量之前对其进行赋值，否则会抛出运行时错误。

​	•	**示例**：

```dart
late String description;

void setDescription(String desc) {
  description = desc;
}
```

