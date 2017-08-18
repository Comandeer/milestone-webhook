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
			const inputs = {
				't/6785b': '6785',
				't/6660': '6660',
				't/156-alpha': '156',
				't/10-alpha-4': '10',
				'bet/134': null,
				'hotfix-not': null
			};

			Object.keys( inputs ).forEach( ( input ) => {
				expect( getParentIssue( input, '' ) ).to.equal( inputs[ input ] );
			} );
		} );

		it( 'returns issue number from PR description', () => {
			const inputs = {
				'closes #536': '536',
				'close #1356': '1356',
				'closed #4567': '4567',
				'fix #657': '657',
				'fixes #999': '999',
				'fixed #543': '543',
				'resolve #214': '214',
				'resolves #333': '333',
				'resolved #111': '111',
				'whatever\n\tresolve #212\n': '212',
				'fixes #456\twhatever': '456',
				'Closes #587': '587',
				'closes #4567 test 123': '4567',
				'closes': null,
				'closes issue #444': null,
				'#222': null,
				'cl ose #25': null,
				'closes 444': null
			};

			Object.keys( inputs ).forEach( ( input ) => {
				expect( getParentIssue( '', input ) ).to.equal( inputs[ input ] );
			} );
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
