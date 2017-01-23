import {createPartStore, createReducer} from '../index';

let modelState = {
	name: 'Tom',
	age: 12,
	isboy: true,
	address: {
		city: 'Guangzhou',
		school: 'SCUT'
	}
};

let initState = modelState;

const namespace = 'merge';
const partStore = createPartStore(namespace, modelState);
const reducer = createReducer(namespace, initState);

export { namespace , partStore, reducer }