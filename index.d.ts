/**
 * simple-redux 工具包类型定义文件
 */


/**
 * 分store类定义
 */
declare class PartSore<Model> {

	state: Model 

	merge(diffObj: Model) : PartSore<Model> 

	mergeDeep(diffObj: Model): PartSore<Model>

	// 
	// 注意，用这个语法时，必须确保 oldObject 是对象
	// [TODO] 待 vsCode 的 IntelliSense 错误，修复后才来支持
	// [Note] 如果用对象遍历的方式实现该方法，有额外的性能开销，需继续探究
	// 
	//_mergeIn<PartState>(oldObject: PartState , diffObj: PartState) : PartSore<Model>

	mergeIn(path: string | string[] , diffObj: Object) : PartSore<Model>

	set(path: string | string[], newValue: any): PartSore<Model>

	update(path: string | string[] , updater: (oldValue: any) => any ): PartSore<Model>

}


/**
 * simple-redux 的 reducer 生成器
 * @template Reducer 生成的 reducer
 * @template Model 组件的数据模型
 * @param namespace 组件（容器）前缀, 格式 'abc/edf'
 * @param initState 初始化state
 */
export function createReducer<Reducer, Model>(namespace: string, initState: Model, otherReducer?: any): Reducer


/**
 * simple-redux 的 partStore 生成器
 * @template Model 组件的数据模型
 * @param namespace 组件（容器）前缀, 格式 'abc/edf'
 * @param mockState 组件的 mockState, 即 state 模型文档
 */
export function createPartStore<Model>(namespace: string, mockState: Model ): PartSore<Model>


/**
 * component actions log 中间件
 */
export function createLoggableActions<Action>( namespace: string, rawAction: Action): Action