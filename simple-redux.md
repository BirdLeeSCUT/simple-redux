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

### .mergeIn(keyPath: string | [string] , diffObj: PartialModelState ): PartSore
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

### mergeDeep(diffObj: PartialModelState): PartSore
这是一个强大的深度合并函数，可以实现同时修改多个不同深度的对象属性，见下面的例子

```javascript
//初始数据
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
})

//进行深度合并更新
ps.mergeDeep({
	name: 'Tom',
	address: {
		city: 'Guangzhou',
		school: {
			section: 'North'
		}
	}
});

//结果如下
expect(ps.state).to.deep.equal({
	name: 'Tom',
	age: 20,
	address: {
		provice: 'Zhejiang',
		city: 'Guangzhou',
		school: {
			university: 'SCUT',
			campus: 'UniversityCity',
			section: 'North'
		}
	}
})

```

### set(keyPath: string | [string], newValue: any): PartSore
单独地设置任何一个对象属性的值，见下

```javascript

expect(ps.state).to.deep.equal({
	name: 'Tom',
	address: {
		provice: 'Zhejiang',
		city: 'Guangzhou',
		school: {
			university: 'SCUT',
			campus: 'UniversityCity',
			section: 'North'
		}
	}
})

//用 set 写法
ps.set('name.provice', 'Guangdong');
//等价的 mergeDeep 写法
ps.mergeDeep({name:{provice: 'Guangdong'}})

//结果
expect(ps.state).to.deep.equal({
	name: 'Tom',
	address: {
		provice: 'Zhejiang',
		city: 'Guangdong',
		school: {
			university: 'SCUT',
			campus: 'UniversityCity',
			section: 'North'
		}
	}
});

```
等价的 merge* 写法带智能对象结构提示，虽然代码稍长了一点，但输入效率会高很多。大多数情况下可以用 merge* 方法替代 set。

### update(keyPath: string | string[] , updater: (oldValue: any) => any ): PartSore
@param keyPath : string | string[]  要更改的属性路径
@param updater: (oldValue: any) => any 更新器，是一个函数，传入旧的值，返回新的值

全功能的更新操作，update函数相比于 meege/set 的特殊之处在于可以简单的老的值去设置新值，见下面2个例子。

```javascript
//例子1，keyPath 所指的值为简单值，如 字符串，数字，布尔值

// 原始值
expect(ps.state).to.deep.equal({
	name: 'Tom',
	info: {
		age: 12
	}
});
//使用update方法
ps.update('info.age', age => age + 1);
//或者使用mergeDeep方法
ps.mergeDeep({ info: {age: ps.state.info.age + 1 }});
//结果如下
expect(ps.state).to.deep.equal({
	name: 'Tom',
	info:{
		age: 13
	}
});

```

```javascript
//例子2， keyPath 所指的值为数组

//原始值
expect(ps.state).to.deep.equal({
	name: 'Tom',
	pets: [{
		id: '0123'
		nick: 'Pappy'
	}]
});
//使用update方法 在 pets 数组处 增加一个元素
ps.update('pets', pets => pets.push({
	id: '0124'
	nick: 'Kitty'
}))
//使用 set 方法结合 es6 语法实现相同的功能
ps.set('pets', [...ps.state.pets, {
	id: '0124'
	nick: 'Kitty'
}])


//结果
expect(ps.state).to.deep.equal({
	name: 'Tom',
	pets: [{
		id: '0123'
		nick: 'Pappy'
	},{
		id: '0124'
		nick: 'Kitty'
	}]
});

```
这里要特别注意，update 函数参数传入的数组不是原生js的 Array 类型, 而是 immutable.js 的 List 类型，因此对齐进行操作需要使用List类型支持的方法，详见[这里](https://facebook.github.io/immutable-js/docs/#/List) , 包含详细的 List 操作函数，包括增加元素，提取元素，删除元素等。


```javascript
//例子3， keyPath 所指的值为对象

expect(ps.state).to.deep.equal({
	name: 'Tom',
	address: {
		from: 'Guangzhou',
		live: 'Guangzhou',
		local: undefined
	}
});

//用 update 更新
ps.update('address', addr => addr.set('local', addr.get('from') == addr.get('live')));
//等价的 set 更新
ps.update('address.local', ps.address.from == ps.address.from );

// 结果
expect(ps.state).to.deep.equal({
	name: 'Tom',
	address: {
		from: 'Guangzhou',
		live: 'Guangzhou',
		local: true
	}
});

```
这里统一要注意，update 函数参数传入的对象并不是原生Object，而是 immutable.js 的 Map 类型，需要使用 Map类型的方法进行读写操作。课件如果要更新对象的值，使用 Object 不一定会带来方便。

