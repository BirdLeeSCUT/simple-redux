//node 环境兼容
if(typeof window === "undefined" ) global.window = global;

var expect = require('chai').expect;
var redux = require('redux');

var testMergeModel = require('./testMerge.model');
var testMergeInModel = require('./testMergeIn.model');
var testMergeDeepModel = require('./testMergeDeep.model');

//生成总reducer
let reducerList = {};
reducerList[testMergeModel.namespace] = testMergeModel.reducer;
reducerList[testMergeInModel.namespace] = testMergeInModel.reducer;
reducerList[testMergeDeepModel.namespace] = testMergeDeepModel.reducer;

//生成总store，并挂载到根命名空间
window.store = redux.createStore(redux.combineReducers(reducerList));

//以下是测试用例
describe('partStore', function () {

	describe('#merge()', () => {

		let ps = testMergeModel.partStore;
		let preState = ps.state;

		it('check the state in testMergeModel', () => {
			expect(ps.state).to.deep.equal({
				name: 'Tom',
				age: 12,
				isboy: true,
				address: {
					city: 'Guangzhou',
					school: 'SCUT'
				}
			});
		})

		it('merge one property with simple value', () => {
			ps.merge({name: 'Ammiy'});
			expect(ps.state).to.deep.equal({
				name: 'Ammiy',
				age: 12,
				isboy: true,
				address: {
					city: 'Guangzhou',
					school: 'SCUT'
				}
			});
		});

		it('not equal preState after merge', () => {
			expect(ps.state).to.not.equal(preState);
		});

		it('merge one property with a object', () => {
			ps.merge({address:{
				city: 'Shanghai'
			}});
			expect(ps.state).to.deep.equal({
				name: 'Ammiy',
				age: 12,
				isboy: true,
				address: {
					city: 'Shanghai'
				}
			})
		})

		it('merge multi property with simple value', () => {
			ps.merge({name: 'Tom', age: 16, isboy: false});
			expect(ps.state).to.deep.equal({
				name: 'Tom',
				age: 16,
				isboy: false,
				address: {
					city: 'Shanghai'
				}
			});
		});

		it('merge into a unset property', () => {
			//This is only a test, and we should avoid to add new property that does not exit in modelState.
			//Maybe we should give some notification when it happens
			ps.merge({ tall: 148 });
			expect(ps.state).to.deep.equal({
				name: 'Tom',
				age: 16,
				isboy: false,
				address: {
					city: 'Shanghai'
				},
				tall: 148 
			});

		});

	});


	describe('#mergeIn()', () => {

		let ps = testMergeInModel.partStore;
		let preState = ps.state;

		it('check the state in testMergeInModel',() => {
			expect(ps.state).to.deep.equal({
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
			});
			expect(preState).to.be.equal(ps.state);
		});

		it('check the immutable character', () => {
			ps.mergeIn('address', {});
			expect(ps.state).to.not.equal(preState);
			expect(ps.state.address).to.not.equal(preState.address);
			expect(ps.state.pets).to.be.equal(preState.pets);
		})

		it('mergeIn to simple keyPath', () => {
			ps.mergeIn('address', {
				provice: 'Zhejiang',
				city: 'Hangzhou'
			});
			expect(ps.state).to.deep.equal({
				name: 'Peter',
				address: {
					provice: 'Zhejiang',
					city: 'Hangzhou',
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
			});
		});

		it('mergeIn to complex keyPath, link by .', () => {
			ps.mergeIn('address.school', {
				campus: 'UniversityCity',
				section: 'Center'
			});
			expect(ps.state).to.deep.equal({
				name: 'Peter',
				address: {
					provice: 'Zhejiang',
					city: 'Hangzhou',
					school: {
						university: 'SCUT',
						campus: 'UniversityCity',
						section: 'Center'
					}
				},
				pets: [{
					name: 'cat',
					nick: 'Kitty'
				}]
			});
		});

		it('mergeIn to complex keyPath, link by []', () => {
			ps.mergeIn(['address','school'], {
				campus: 'Wushan',
				section: 'North'
			});
			expect(ps.state).to.deep.equal({
				name: 'Peter',
				address: {
					provice: 'Zhejiang',
					city: 'Hangzhou',
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
			});
		});

		it('mergeIn to a path with array index, link by []', () => {
			let petId = 0;
			ps.mergeIn(['pets', petId],{
				nick: 'Pappy'
			});
			expect(ps.state).to.deep.equal({
				name: 'Peter',
				address: {
					provice: 'Zhejiang',
					city: 'Hangzhou',
					school: {
						university: 'SCUT',
						campus: 'Wushan',
						section: 'North'
					}
				},
				pets: [{
					name: 'cat',
					nick: 'Pappy'
				}]
			})
		})

	});


	describe('#mergeDeep()', () => {
		let ps = testMergeDeepModel.partStore;
		let preState = ps.state;

		it('check the state in testMergeDeepModel', () => {
			expect(ps.state).to.deep.equal({
				name: 'Peter',
				address: {
					city: 'Hangzhou',
					school: {
						university: 'SCUT',
						campus: 'UniversityCity',
						section: 'Center'
					}
				}
			})
		})

		//it('check the ')

	})

});