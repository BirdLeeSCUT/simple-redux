import {createReducer, createPartStore} from '../index';

let modelState = {
	name: 'Tom',
	info: {
		age: 13
	},
	pets: [{
		id: '0123',
		nick: 'Pappy'
	}]
};

let initState = modelState;

const namespace = 'update';
const partStore = createPartStore(namespace, modelState);
const reducer = createReducer(namespace, initState);

export { namespace , partStore, reducer }