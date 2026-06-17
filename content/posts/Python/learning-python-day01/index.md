---
title: "Python学习记录 Day01 - 基础入门"
date: 2026-06-17T00:00:00+08:00
draft: false
author: "AnfinsenYu"
categories: ["技术", "Python"]
tags: ["Python", "学习记录", "入门"]
showToc: true
description: "Python基础入门：变量、数据类型、列表、字典、元组、集合、切片、列表推导式"
---

> 学习时间：2026年6月17日
> 学习内容：01\_basics.py + 02\_data\_structures.py
> 学习时长：约2小时

---

## 一、今日学习目标

1. 了解Python与C/Java的差异
2. 掌握变量、数据类型
3. 掌握列表、字典、元组、集合
4. 理解切片、列表推导式

---

## 二、学习内容

### 1. 变量与数据类型

- Python是**动态类型语言**，不需要声明变量类型
- 一切皆对象（int也是对象）
- 没有char类型，字符串就是str

```python
x = 10          # 整数 int
x = 3.14        # 浮点数 float
x = "hello"     # 字符串 str
x = True        # 布尔值 bool
x = None        # 空值 NoneType
```

### 2. 布尔值（Boolean）

- 只有两个值：`True`（真）和 `False`（假）
- 用于条件判断

```python
age = 20
print(age > 18)  # True（是大于18的）
```

### 3. 类型转换

| 函数 | 英文 | 作用 |
|------|------|------|
| `int()` | integer | 转整数 |
| `str()` | string | 转字符串 |
| `float()` | floating-point | 转浮点数 |

```python
int("42")       # 字符串 → 整数
str(42)         # 整数 → 字符串
float("3.14")   # 字符串 → 浮点数
```

**Python不会自动转换类型**：
```python
print("age: " + 18)           # ❌ 报错 TypeError
print("age: " + str(18))      # ✅ 必须显式转换
```

### 4. f-string格式化

`f` = format（格式化），可以在字符串里嵌入变量：

```python
name = "张三"
age = 25
print(f"我叫{name}，今年{age}岁")  # 我叫张三，今年25岁
```

### 5. 列表（List）

有序、可变的集合：

```python
fruits = ["apple", "banana", "orange"]
fruits.append("kiwi")      # 末尾添加
fruits.insert(1, "mango")  # 位置1插入
fruits.remove("banana")    # 删除指定值
popped = fruits.pop()      # 弹出最后一个（删除+返回）
```

### 6. 切片（Slice）

```python
nums = [0, 1, 2, 3, 4, 5]
nums[1:4]    # [1, 2, 3]  从索引1到3（不含4）
nums[:3]     # [0, 1, 2]  从头到索引2
nums[::2]    # [0, 2, 4]  每隔一个
nums[::-1]   # 反转
```

**记住**：`nums[开始:结束:步长]`，包含开始，不包含结束

### 7. 字典（Dict）

键值对集合：

```python
person = {"name": "张三", "age": 25}
person["name"]                    # 访问
person.get("phone", "未知")       # 安全访问
person["email"] = "xx@xx.com"     # 添加
```

### 8. 集合（Set）

无序、不重复：

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
a | b   # 并集 {1,2,3,4,5,6}
a & b   # 交集 {3,4}
a - b   # 差集 {1,2}（a有b没有的）
```

### 9. 元组（Tuple）

不可变的列表：

```python
colors = ("red", "green", "blue")
colors[0]         # ✅ 可以读
colors[0] = "x"   # ❌ 不能改
```

元组可以作为字典的key（列表不行）

### 10. 列表推导式

```python
# 传统写法
squares = []
for x in range(5):
    squares.append(x ** 2)

# 推导式写法（一行）
squares = [x ** 2 for x in range(5)]

# 带条件
evens = [x for x in range(10) if x % 2 == 0]
```

---

## 三、踩的坑

### 坑1：f-string的f不能丢

```python
name = "张三"
print("我叫{name}")    # ❌ 输出：我叫{name}
print(f"我叫{name}")   # ✅ 输出：我叫张三
```

### 坑2：列表不支持 `&` 运算符

```python
list_a = [1, 2, 3]
list_b = [2, 3, 4]
list_a & list_b        # ❌ 报错 TypeError

# 必须先转集合
a = set(list_a)
b = set(list_b)
a & b                  # ✅ {2, 3}
```

### 坑3：`[]` 不要乱加

```python
a = {1, 2}
b = {2, 3}
common = [a & b]       # ❌ 结果是 [{2,3}]，多了一层
common = a & b         # ✅ 结果是 {2, 3}
```

### 坑4：`is` 和 `==` 的区别

```python
# == 比较值
# is 比较是否同一个对象

x % 2 == 0   # ✅ 比较值，推荐
x % 2 is 0   # ⚠️ 能跑但不规范
```

**建议**：比较值用 `==`，判断None用 `is`

### 坑5：pop() 会删除元素

```python
fruits = ["a", "b", "c"]
last = fruits.pop()   # last = "c"，fruits变成["a", "b"]
```

如果只想取值不删除，用 `fruits[-1]`

---

## 四、今日问答记录

| 问题 | 答案 |
|------|------|
| 布尔值是什么？ | 真或假，True/False，用于条件判断 |
| f是什么意思？ | format（格式化），f"..."可以在字符串里嵌入变量 |
| int/str/float是什么缩写？ | integer/string/floating-point |
| print(type(1))是什么意思？ | type()查看数据类型，输出 `<class 'int'>` |
| append是什么意思？ | 追加，在列表末尾加一个元素 |
| item是什么意思？ | 条目，字典里的一个键值对 |
| hashable是什么？ | 可哈希的，能算出唯一编号，不可变类型才能当字典key |
| def是define吗？ | 是的，define（定义）的缩写 |
| 差集是什么？ | 你有但他没有的，a - b |
| \*\*是平方吗？ | \*\*是幂运算，\*\*2是平方，\*\*3是立方 |
| 为什么列表不能用&？ | &是集合的运算符，列表不支持 |
| get\_position()是什么函数？ | 示例里自定义的函数，不是内置的 |

---

## 五、学习心得

1. Python比C/Java简洁很多，读起来像英语
2. 动态类型很方便，但要注意类型转换
3. f-string比C的printf和Java的String.format好用
4. 列表推导式是Python的特色，一行顶三行
5. 集合运算（并集、交集、差集）很实用

---

## 六、明日计划

- [ ] 学习 03\_strings.py（字符串）
- [ ] 学习 04\_functions.py（函数）
- [ ] 完成练习文件中的对应练习

---

## 七、术语对照表

| 中文 | English | 说明 |
|------|---------|------|
| 变量 | Variable | 存储数据的容器 |
| 数据类型 | Data Type | 数据的种类 |
| 布尔值 | Boolean | True或False |
| 列表 | List | 有序可变集合 |
| 字典 | Dictionary | 键值对集合 |
| 元组 | Tuple | 有序不可变集合 |
| 集合 | Set | 无序不重复集合 |
| 切片 | Slice | 截取部分数据 |
| 推导式 | Comprehension | 简洁创建集合的语法 |
| 幂运算 | Power | \*\* 运算符 |
| 追加 | Append | 在末尾添加元素 |
| 弹出 | Pop | 取出并删除元素 |
| 交集 | Intersection | 都有的元素 |
| 差集 | Difference | 你有他没有的 |
| 并集 | Union | 合并去重 |
| 哈希 | Hash | 计算唯一编号 |
| 格式化 | Format | 插入变量到字符串 |
