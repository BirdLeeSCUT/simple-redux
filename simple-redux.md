# simple-redux 框架

## 工具函数

### function createReducer(namespace: string, initState: PartialModelState, otherState ?: Reducer): Reducer
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
下面涉及的例子有时会只用这种断言方式表示，这里都使用chai断言库，如果想详细了解，请查看[相关资料](http://chaijs.com/api/bdd/)。

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

### function createPartStore(namespace: string, modelState: ModelState ): PartSore
这是创建 partStore 的函数，两个参数比较明确，在此就不进行详细解释了。partStore的API会在下面详细地解释。

### function createLoggableActions<Action>( namespace: string, rawAction: Action): Action
这是创建带log功能的action包， 这种action包里的action被调用后，都会显示 函数的完整名称和调用时的实际参数。该函数在 action 文件中使用。

## partStore API
下面详细介绍 partStore 对象的API：

### .state 
.state 属性是一个 getter, 通过 partStore.state 用户可以在智能提示下方便地读取到目标数据。

### .merge(diffObj: PartialModelState ): PartSore
@param diffObj 表示执行要更新的内容。
注意该函数值进行第一级属性的更新。该函数完成后返回当前 PartStore对象。下面我们均用 ps 表示 partSore。请见下面几个例子：

```javascript
//初始状态
expect(ps.state).to.deep.equal({
	name: 'Peter',
	age: 20,
	address: {
		city: 'Guangzhou',
		school: 'SCUT'
	}
});

// 例子1：最简单的用法, 更改 state 的属性值
ps.merge({
	name: 'Tom',
	age: 32
});

expect(ps.state).to.deep.equal({
	name: 'Tom',
	age: 32,
	address: {
		city: 'Guangzhou',
		school: 'SCUT'
	}
});

// 例子2：当更改一个属性值的值为对象时，是把整个对象替换掉，而不是合并
ps.merge({
	address: {
		city: 'Shanghai'
	}
});

expect(ps.state)to.deep.equal({
	name: 'Tom',
	age: 32,
	address: {
		city: 'Shanghai'
	}
});

```

### .mergeIn(path: string | [string] , diffObj: PartialModelState ): PartSore
@param path: string | [string] 指定要合并的对象, 支持字符串和数组两种格式，见下面的例子
@param diffObj: PartialModelState 更新的内容，同 PartSore.merge
例子如下：

```javascript

//初始状态
expect(ps.state).to.deep.equal({
	name: 'Peter',
	age: 20,
	address: {
		provice: 'Guangdong',
		city: 'Guangzhou',
		school: {
			university: 'SCUT',
			campus: 'Wushan',
			section: 'North'
		}
	}
});

//path参数处使用 string 格式的来指定更改位置
ps.mergeIn('address', {
	provice: 'Zhejiang',
	city: 'Hangzhou'
})

expect(ps.state).to.deep.equal({
	name: 'Peter',
	age: 20,
	address: {
		provice: 'Zhejiang',
		city: 'Hangzhou',
		school: {
			university: 'SCUT',
			campus: 'Wushan',
			section: 'North'
		}
	}
});

//path 参数处使用 点句法 或 数组 格式的来指定更改位置
ps.mergeIn('address.school', {
	campus: 'UniversityCity',
	section: 'Center'
});

ps.mergeIn(['address','school'], {
	campus: 'UniversityCity',
	section: 'Center'
});

expect(ps.state).to.deep.equal({
	name: 'Peter',
	age: 20,
	address: {
		provice: 'Zhejiang',
		city: 'Hangzhou',
		school: {
			university: 'SCUT',
			campus: 'UniversityCity',
			section: 'Center'
		}
	}
});

```

path 处支持数组格式主要是为了支持使修改包含数组序号的路径所指的对象时更方便，看下面的复杂的例子

```javascript
//原始数据
expect(ps.state).to.deep.equal({
	name: 'Tom',
	pets: [
		{
			name: 'Pappy',
			type: 'dog',
			foods: [{
				name: 'bone',
				quantity: 2,
				addDate: '2017-01-20'
			}]
		}
	]
})

let petsNumber = 0, foodNumber = 1;
//path 使用数组模式
ps.mergeIn(['pets', petsNumber, 'foods', foodNumber], {
	quantity: 5,
	addDate: '2017-01-21'
})

//path 使用字符串模式
ps.mergeIn('pets.' + petsNumber + '.foods.'+ foodNumber, {
	quantity: 5,
	addDate: '2017-01-21'
})

//结果
expect(ps.state).to.deep.equal({
	name: 'Tom',
	pets: [
		{
			name: 'Pappy',
			type: 'dog',
			foods: [{
				name: 'bone',
				quantity: 5,
				addDate: '2017-01-21'
			}]
		}
	]
})

```