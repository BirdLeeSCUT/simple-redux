import * as sr from '../index';

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
const partStore = sr.createPartStore(namespace, modelState);
const reducer = sr.createReducer(namespace, initState);

export { namespace , partStore, reducer }