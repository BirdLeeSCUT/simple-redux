var expect = require('chai').expect;
var immutable = require('immutable');

let rawState = {
	name: 'a',
	pets: {
		nick: 'Puppy'
	}
}
let imState = immutable.fromJS(rawState);

describe('Immutable Test', () => {

	it('with a set operation, get property value by #get(), be equal', () => {
		let oldPets = imState.get('pets');
		imState.set('name', 'b');
		expect(imState.get('pets')).to.equal(oldPets);
	});

	it('with a set operation, get property value by #toJS(), be not equal', () => {
		let oldPets = imState.toJS().pets;
		imState.set('name', 'c');
		expect(imState.toJS().pets).to.not.equal(oldPets);
	});

	it('without operation, get property value by #get(), be equal', () => {
		expect(imState.get('pets')).to.equal(imState.get('pets'));
	});

	it('without operation, get property value by #toJS(), be not equal', () => {
		expect(imState.toJS().pets).to.not.equal(imState.toJS().pets);
	});

	it('without operation, get property value by #toJS(), be not equal', () => {
		expect(imState.toJS()).to.be.not.equal(imState.toJS());
	});


})