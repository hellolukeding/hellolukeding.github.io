## 接口定义

```go
package main

import "fmt"

// 定义一个接口
type Speaker interface {
    Speak() string
}

// 实现接口的类型
type Person struct {
    Name string
}

func (p Person) Speak() string {
    return "Hello, my name is " + p.Name
}

type Dog struct {
    Name string
}

func (d Dog) Speak() string {
    return "Woof! My name is " + d.Name
}

func main() {
    // 创建接口类型的变量
    var s Speaker

    // 将具体类型赋值给接口变量
    s = Person{Name: "John"}
    fmt.Println(s.Speak())

    s = Dog{Name: "Buddy"}
    fmt.Println(s.Speak())
}
```

## 空接口用于存储任何数据

```go
package main

import "fmt"

func PrintAnything(a interface{}) {
    fmt.Println(a)
}

func main() {
    PrintAnything(42)
    PrintAnything("Hello")
    PrintAnything(true)
    PrintAnything([]int{1, 2, 3})
}
```

## 接口类型断言

```go
value, ok := interfaceVariable.(ConcreteType)
```

```go
package main

import "fmt"

func PrintSpecific(a interface{}) {
    switch v := a.(type) {
    case int:
        fmt.Println("Integer:", v)
    case string:
        fmt.Println("String:", v)
    default:
        fmt.Println("Unknown type")
    }
}

func main() {
    PrintSpecific(42)
    PrintSpecific("Hello")
    PrintSpecific(true)
}
```
