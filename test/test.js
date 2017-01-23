//node 环境兼容
if(typeof window === "undefined" ) global.window = global;

var expect = require('chai').expect;
var redux = require('redux');

var testMergeModel = require('./testMerge.model');
var testMergeInModel = require('./testMergeIn.model');
var testMergeDeepModel = require('./testMergeDeep.model');
var testSetModel = require('./testSet.model');
var testUpdateModel = require('./testUpdate.model');

//生成总reducer
let reducerList = {};
reducerList[testMergeModel.namespace] = testMergeModel.reducer;
reducerList[testMergeInModel.namespace] = testMergeInModel.reducer;
reducerList[testMergeDeepModel.namespace] = testMergeDeepModel.reducer;
reducerList[testSetModel.namespace] = testSetModel.reducer;
reducerList[testUpdateModel.namespace] = testUpdateModel.reducer;

//生成总store，并挂载到根命名空间
window.store = redux.createStore(redux.combineReducers(reducerList));

//以下是测试用例
describe('partStore', function () {

	describe('#merge()', function () {

		let ps = testMergeModel.partStore;
		let preState = ps.state;

		it('check the state in testMergeModel', function () {
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

		it('merge one property with simple value', function () {
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

		it('not equal preState after merge', function () {
			expect(ps.state).to.not.equal(preState);
		});

		it('merge one property with a object', function () {
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

		it('merge multi property with simple value', function () {
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

		it('merge into a unset property', function () {
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

		it('check the state in testMergeInModel', function () {
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

		it('mergeIn to simple keyPath', function () {
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

		it('mergeIn to complex keyPath, link by .', function () {
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

		it('mergeIn to complex keyPath, link by []', function () {
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

		it('mergeIn to a path with array index, link by []', function () {
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


	describe('#mergeDeep()', function() {
		let ps = testMergeDeepModel.partStore;
		let preState = ps.state;

		it('check the state in testMergeDeepModel', function() {
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

		it('should merge new value into deep path', function(){
			ps.mergeDeep({
				name: 'Tom',
				address: {
					city: 'Guangzhou',
					school: {
						section: 'North'
					}
				}
			});

			
			expect(ps.state).to.deep.equal({
				name: 'Tom',
				address: {
					city: 'Guangzhou',
					school: {
						university: 'SCUT',
						campus: 'UniversityCity',
						section: 'North'
					}
				}
			})

		})

	});


	describe('#set()', function() {
		let ps = testSetModel.partStore;
		let preState = ps.state;

		it('should contain the initState', function(){
			expect(ps.state).to.deep.equal({
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
			});
		});

		it('should set simple path', function(){
			ps.set('name', 'Ammiy');
			expect(ps.state).to.deep.equal({
				name: 'Ammiy',
				address: {
					provice: 'Zhejiang',
					city: 'Guangzhou',
					school: [{
						university: 'SCUT',
						campus: 'UniversityCity',
						section: 'North'
					}]
				}
			});
		});

		it('should set complex path via . grammar', function(){
			ps.set('address.provice', 'Guangdong');
			expect(ps.state).to.deep.equal({
				name: 'Ammiy',
				address: {
					provice: 'Guangdong',
					city: 'Guangzhou',
					school: [{
						university: 'SCUT',
						campus: 'UniversityCity',
						section: 'North'
					}]
				}
			});
		});

		it('should set complex path via [] grammar, include array index', function(){
			ps.set(['address', 'school', 0, 'section'], 'Center');
			expect(ps.state).to.deep.equal({
				name: 'Ammiy',
				address: {
					provice: 'Guangdong',
					city: 'Guangzhou',
					school: [{
						university: 'SCUT',
						campus: 'UniversityCity',
						section: 'Center'
					}]
				}
			});
		});

	});


	describe('#update()', function(){
		let ps = testUpdateModel.partStore;
		let preState = ps.state;

		it('should contain the initState', function() {
			expect(ps.state).to.deep.equal({
				name: 'Tom',
				info: {
					age: 13
				},
				pets: [{
					id: '0123',
					nick: 'Pappy'
				}]
			});
		});

		it('should update simple value', function() {
			ps.update('info.age', age => age + 1);
			expect(ps.state).to.deep.equal({
				name: 'Tom',
				info: {
					age: 14
				},
				pets: [{
					id: '0123',
					nick: 'Pappy'
				}]
			});
		});

		it('should update array', function() {
			ps.update('pets', pets => pets.push({
				id: '0124',
				nick: 'Puppy'
			}));
			expect(ps.state).to.deep.equal({
				name: 'Tom',
				info: {
					age: 14
				},
				pets: [{
					id: '0123',
					nick: 'Pappy'
				},{
					id: '0124',
					nick: 'Puppy'
				}]
			});
		});

		it('should update object', function() {
			ps.update('pets.0', pet => pet.set('id', pet.get('nick')));
			expect(ps.state).to.deep.equal({
				name: 'Tom',
				info: {
					age: 14
				},
				pets: [{
					id: 'Pappy',
					nick: 'Pappy'
				},{
					id: '0124',
					nick: 'Puppy'
				}]
			});
		});

	});

});