/**
 * 标准 reducer 工具包
 */

import {fromJS, Map} from 'immutable';

/**
 * partStore 生成器
 * 注意，要使用 partStore 的 神奇力量，需要把 store 挂载到 window 上
 * 
 * selector 为 state 选择器，格式为 'prop1.prop2'
 * 
 * 如果使用 partStore 模式，那么 action 就不需要进行 dispatch 包装，只要在最后一级发出原生 action 时再进行dispatch包装
 * 
 * 
 */
let createPartStore = (namespace) => {

	let getType = (param) => {
		let _t;
		return ((_t = typeof (param)) == "object" ? Object.prototype.toString.call(param).slice(8, -1) : _t).toLowerCase();   
	}

	//供生成 set 操作
	let setRaw = () => (index , newValue) => {
		let arrIndex;
		if( getType(index) == 'string')
			arrIndex = index.split('.');
		else if ( getType(index) == 'array')
			arrIndex = index;
		else
			throw new Error('Index should be string or array');

		window.store.dispatch({
			type: namespace + '/set',
			payload: {
				arrIndex,
				newValue
			}
		})
		return partStore;
	};


	//供生成 merge 和 mergeDeep 操作
	let mergeRaw = deep => (arg1, arg2) => {

		if( getType(arg1) == 'object'){
			window.store.dispatch({
				type: namespace + '/merge',
				payload: {
					in: false,
					deep,
					diff: arg1
				}
			})
		}else{
			let arrIndex;
			if( getType(arg1) == 'string')
				arrIndex = arg1.split('.');
			else if ( getType(arg1) == 'array')
				arrIndex = arg1;
			else
				throw new Error('Index should be string or array');

			window.store.dispatch({
				type: namespace + '/merge',
				payload: {
					in: true,
					deep,
					arrIndex,
					diff: arg2
				}
			})

		}

		return partStore;
	}
	//供生成 updateRaw 操作
	let updateRaw = () => (index, updater) => {
		let arrIndex;
		if( getType(index) == 'string')
			arrIndex = index.split('.');
		else if ( getType(index) == 'array')
			arrIndex = index;
		else
			throw new Error('Index should be string or array');


		window.store.dispatch({
			type: namespace + '/update',
			payload: {
				arrIndex,
				updater
			}
		})

		return partStore;
	}

	let partStore = {

		/**
		 * state 读取器
		 */
		get state () {
			let selectorArr = namespace.split('/');

			return selectorArr.reduce((preValue, thisVale) => {
				return preValue[thisVale];
			}, window.store.getState());

		},

		/** 
		 * set 操作, 集成了 immutable::Map 的 set 和 setIn
		 */
		set: setRaw(),

		/**
		 * merge 操作，集成了 immutable::Map 的
		 */
		merge: (diff) => mergeRaw(false)(diff),

		/**
		 * mergeIn 操作，集成了 immutable::Map 的
		 */
		mergeIn: (arg1, arg2) => mergeRaw(false)(arg1, arg2),

		//mergeDeep 操作
		mergeDeep: mergeRaw(true),

		//update 操作
		update: updateRaw()

	}

	return partStore;
}


/**
 * 标准 reducer 生成器
 * namespace 前缀格式 'abc/edf'
 */
let createReducer = (_namespace, initState, otherReducer = null ) => {

	let namespace = _namespace.replace('.','/');

	let newReducer = (state = initState , action) => {

		//不是该名空间的直接返回
		if(action.type.indexOf(namespace + '/') != 0)
			return state;

		// 根据条件选择 是否需要 imState 转换
		let imState;
		if(Map.isMap(state))
			imState = state;
		else
			imState = fromJS(state);

		let payload = action.payload;

		//制定3个标准reducer
		switch( action.type ){
			case namespace + '/set':
				imState = imState.setIn( payload.arrIndex, payload.newValue );
				break;
			case namespace + '/merge':
				if(payload.in){
					if(payload.deep)
						imState = imState.mergeDeepIn( payload.arrIndex, payload.diff );
					else
						imState = imState.mergeIn( payload.arrIndex, payload.diff );
				}else{
					if(payload.deep)
						imState = imState.mergeDeep(payload.diff);
					else
						imState = imState.merge(payload.diff);
				}
				break;
			case namespace + '/update':
				imState = imState.updateIn( payload.arrIndex, payload.updater );

				break;
			default:
				console.log('发起了非sr标准的动作: ' + action.type + ', 当前名空间为：' + namespace); 

		}

		// 根据条件选择 是否需要 imState 复原转换
		if(Map.isMap(state))
			return imState;
		else
			return imState.toJS();

	}

	//合并其他reducer
	let finalReducer;
	if( otherReducer ){
		console.log('存在合并的 reducer');
		finalReducer = (state = initState , action) => {
			return otherReducer(newReducer(state , action), action);
		}
	}else{
		finalReducer = newReducer;
	}

	return finalReducer;

} 


/**
 * component actions log 中间件
 */
let createLoggableActions = (namespace, rawActions) => {
	let actions = {};

	for (var actionName in rawActions) {
		if (rawActions.hasOwnProperty(actionName)) {
			let _actionName = actionName;
			actions[actionName] = function(){
				console.log('%c comAction: ' + namespace + '/' + _actionName , 'color: #069; font-weight:600', arguments);
				rawActions[_actionName](...arguments);
			}
		}
	}
	return actions;
};



export { createReducer, createPartStore, createLoggableActions};