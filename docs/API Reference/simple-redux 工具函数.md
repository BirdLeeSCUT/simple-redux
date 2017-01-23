# simple-redux 框架

sr 框架是一套规范和工具函数组成的，下面介绍其工具函数

## function createReducer(namespace: string, initState: PartialModelState, otherState ?: Reducer): Reducer
该函数创建 sr标准reducer

**@param namespace: string**  这个参数指定改reducer的名空间，使用'/'或'.'做层级划分，名空间也确定了当前容器的state在总state的位置，看下面的例子：
我们把 componentA 的 state 命名为 componentAState， 把总 store 中的总 state 表示为 rootState。
如果 componentA 中设置 `namespace = 'order'`, 则 rootState.order == componentAState。
如果 componentA 中设置 `namespace = 'user/myself'`, 则 rootState.user.myself == componentAState。
用 BDD expect 断言的方式表达为

```javascript

if(namespace == 'order'){
	expect( rootState.order ).to.equal( componentAState );
}
if(namespace == 'user.myself'){
	expect( rootState.user.myself ).to.equal( componentAState );
}
if(namespace == 'user/myself'){
	expect( rootState.user.myself ).to.equal( componentAState );
}

```
下面涉及的例子会只用这种断言方式表示，表达效果近似自然语言，这里都使用chai断言库的 BDD expect，如果想详细了解，请查看[相关资料](http://chaijs.com/api/bdd/)。

**@param initState: PartialModelState** 这个参数指定容器的初始化state, PartialModelState 是在 ModelState 签名加上 Partial 生成的。我们用 PartialTypeA 来表示 TypeA 的**部分类型**，在其他文档中还会涉及这个概念。下面举个例子：

```typescript
interface TypeA {
	name: string,
	age: number,
	city: string
}

interface PartialTypeA {
	name?: string, // ?:表示这个属性是可选的
	age?: number,
	city?: string
}

```

**@param otherState ?: Reducer** 这是一个可选的参数，可以传入 该名空间下的其他reducer。这个参数专为从原生 redux 迁移到 sr 的项目涉及。原生 redux 项目可以在任何一个容器的 reducer 文件里把原来的 reducer 升级为 sr标准reducer, 并可以尝试通过 partStore 来方便地更改state。

## function createPartStore(namespace: string, modelState: ModelState ): PartSore
这是创建 partStore 的函数，两个参数比较明确，在此就不进行详细解释了。partStore的API会在下面详细地解释。

## function createLoggableActions<Action>( namespace: string, rawAction: Action): Action
这是创建带log功能的action包， 这种action包里的action被调用后，都会显示 函数的完整名称和调用时的实际参数。该函数在 action 文件中使用。
