import {createReducer, createPartStore} from '../index';

let modelState = {
	name: 'Tom',
	address: {
		provice: 'Zhejiang',
		city: 'Guangzhou',
		school: [{
			university: 'SCUT',
			campus: 'UniversityCity',
			section: 'North'
		}]
	}
};

let initState = modelState;

const namespace = 'set';
const partStore = createPartStore(namespace, modelState);
const reducer = createReducer(namespace, initState);

export { namespace , partStore, reducer }