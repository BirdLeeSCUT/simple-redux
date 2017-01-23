# (Not done yet, To Continue)
## 前言
simple-redux 并不是简化版的 redux, 简称 sr, 而是基于redux + immutable.js 的一种二次标准化构建，相比于原生redux, 要达到的目标有
- 使用抽象的匿名空间来缩短事件传递长度复杂度，匿名空具体实现为为控制实例 partStore
- 提供一种标准的跨组件通讯机制
- 使用typescript相关特性来使数据的读写明确化
- 对渐进式开发做足够的支持

## 特点
- 把 主store 挂载到 全局名空间下，即 window 对象下，以实现可以生成每个容器的 partStore 来大大简化数据的读写。
- 放弃原始 redux 在 React 组件里绑定 dispatcher 的方法，每个函数只需直接的调用对应action包的函数，action包的函数可以方便的处理异步过程，并利用 partStore 的方法来进行完备的数据更新任务。
- 在视图开发时，可以利用 modelState 来明确地读取数据模型；action开发时，可以 partStore 对数据做更新。
- 定义了相对完善的组件规范，提供基础的与标准配套的命令行工具
- 改原生redux 类似“并行线”的很多类型的 action.type 为类似串行线的只有几个标准类型的 action.type，极大地级高了开发效率

## 组件层次划分：
一个完整的容器组件由以下三个部分组成：
- 1、数据模型模块: component.model.js
- 2、视图模块: component.view.jsx + component.style.*ss
- 3、动作模块: component.action.js

各层的的功能职责介绍已分为3个文件描述，请分别查看。在介绍这些组件分层是，可能会涉及与原生redux的比较，如果读者对原始redux不够理解，可以跳过这些内容。我会在确认框架开源后推出入门者 get started 文档和完整的项目案例。