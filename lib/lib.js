'use strict';

const GitHubAPI = require( 'github' );

const github = new GitHubAPI( {
	debug: true,
	headers: {
		'user-agent': 'Milestone-Checker'
	},
	Promise
} );

github.authenticate( {
	type: 'token',
	token: process.env.GH_MSWH_TOKEN
} );

function getParentIssue( name ) {
	return name.match( /t\/(\d+).*/ )[ 1 ];
}

function getBranchFromMilestone( milestone ) {
	if ( typeof milestone === 'string' && milestone.match( /\d+\.\d+\.0/ ) ) {
		return 'major';
	}

	return 'master';
}

function handlePR( { payload } ) {
	if ( [ 'opened', 'edited', 'reopened', 'synchronize' ].indexOf( payload.action.toLowerCase() ) === -1 ) {
		return;
	}

	const pr = payload.pull_request;
	const parentIssueId = getParentIssue( pr.head.ref );

	github.issues.get( {
		owner: process.env.GH_MSWH_OWNER,
		repo: process.env.GH_MSWH_REPO,
		number: parentIssueId
	} ).then( ( { data } ) => {
		const milestone = data.milestone ? data.milestone.title : null;
		const branch = getBranchFromMilestone( milestone );

		return github.repos.createStatus( {
			owner: process.env.GH_MSWH_OWNER,
			repo: process.env.GH_MSWH_REPO,
			sha: pr.head.sha,
			state: branch === pr.base.ref ? 'success' : 'failure',
			context: 'milestone-check',
			description: 'Check if PR is targetted into correct branch'
		} );
	} ).catch( ( e ) => {
		console.error( e ); // eslint-disable-line no-console
	} );
}

exports.getParentIssue = getParentIssue;
exports.getBranchFromMilestone = getBranchFromMilestone;
exports.handlePR = handlePR;
