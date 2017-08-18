'use strict';

const chai = require( 'chai' );
const expect = chai.expect;
const handlePR = require( '../lib/handlePR' );

describe( 'library methods', () => {
	it( 'are functions', () => {
		expect( handlePR ).to.be.a( 'function' );
	} );
} );
