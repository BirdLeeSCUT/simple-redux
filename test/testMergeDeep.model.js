import * as sr from '../index';

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
const partStore = sr.createPartStore(namespace, modelState);
const reducer = sr.createReducer(namespace, initState);

export { namespace , partStore, reducer }