import {createReducer, createPartStore} from '../index';

let modelState = {
	name: 'Peter',
	address: {
		provice: 'Guangdong',
		city: 'Guangzhou',
		school: {
			university: 'SCUT',
			campus: 'Wushan',
			section: 'North'
		}
	},
	pets: [{
		name: 'cat',
		nick: 'Kitty'
	}]
};

let initState = modelState;

const namespace = 'mergeIn';
const partStore = createPartStore(namespace, modelState);
const reducer = createReducer(namespace, initState);

export { namespace , partStore, reducer }