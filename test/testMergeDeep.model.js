import {createReducer, createPartStore} from '../index';

let modelState = {
	name: 'Peter',
	address: {
		city: 'Hangzhou',
		school: {
			university: 'SCUT',
			campus: 'UniversityCity',
			section: 'Center'
		}
	}
};

let initState = modelState;

const namespace = 'mergeDeep';
const partStore = createPartStore(namespace, modelState);
const reducer = createReducer(namespace, initState);

export { namespace , partStore, reducer }