'use strict';

const chai = require( 'chai' );
const expect = chai.expect;
const { getParentIssue, getBranchFromMilestone, handlePR } = require( '../lib/lib' );

describe( 'library methods', () => {
	it( 'are functions', () => {
		expect( getParentIssue ).to.be.a( 'function' );
		expect( handlePR ).to.be.a( 'function' );
	} );

	describe( 'getParentIssue', () => {
		it( 'returns issue number from ticket branch name', () => {
			expect( getParentIssue( 't/6785b' ) ).to.equal( '6785' );
		} );
	} );

	describe( 'getBranchFromMilestone', () => {
		it( 'returns master for x.y.z, backlog and no milestones', () => {
			const inputs = [
				'1.0.1',
				'backlog',
				'BacKLoG',
				null,
				undefined
			];

			inputs.forEach( ( input ) => {
				expect( getBranchFromMilestone( input ) ).to.equal( 'master' );
			} );
		} );

		it( 'returns major for x.y.0', () => {
			const inputs = [
				'1.0.0',
				'6.6.0',
				'637373737.5725627275.0',
			];

			inputs.forEach( ( input ) => {
				expect( getBranchFromMilestone( input ) ).to.equal( 'major' );
			} );
		} );
	} );
} );
