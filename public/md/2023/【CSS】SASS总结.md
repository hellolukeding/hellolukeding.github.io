### 变量

```css
$defaultLinkColor: [[46EAC2]];
a {
  color: $defaultLinkColor;
}
```

### 插值

```css
$wk: -webkit-;

.rounded-box {
  #{$wk}border-radius: 4px;
}
```

### mixin

````css
@mixin heading-font {
    font-family: sans-serif;
    font-weight: bold;
}
h1 {
    @include heading-font;
}

$default-padding: 10px;

@mixin pad($n: $default-padding) {
    padding: $n;
}

body {
    @include pad(15px);
### extend
```css
.button {
    ···
}
.push-button {
    @extend .button;
}

````

### loop

```css
@for $i from 1 through 4 {
  .item-#{$i} {
    left: 20px * $i;
  }
}
$menu-items: home about contact;

@each $item in $menu-items {
  .photo-#{$item} {
    background: url("#{$item}.jpg");
  }
}
$backgrounds: (home, "home.jpg"), (about, "about.jpg");

@each $id, $image in $backgrounds {
  .photo-#{$id} {
    background: url($image);
  }
}
$i: 6;
@while $i > 0 {
  .item-#{$i} {
    width: 2em * $i;
  }
  $i: $i - 2;
}
```

### condition

```css
@if $position == "left" {
  position: absolute;
  left: 0;
} @else if $position == "right" {
  position: absolute;
  right: 0;
} @else {
  position: static;
}
```

### map

```css
$map: (key1: value1, key2: value2, key3: value3);

map-get($map, key1)

```
