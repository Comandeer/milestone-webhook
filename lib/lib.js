'use strict';

const GitHubAPI = require( 'github' );

const github = new GitHubAPI( {
	debug: false,
	headers: {
		'user-agent': 'Milestone-Checker'
	},
	Promise
} );

github.authenticate( {
	type: 'token',
	token: process.env.GH_MSWH_TOKEN
} );

function getParentIssue( name, description ) {
	const matchedName = name.match( /^t\/(\d+)?.*/i );
	const matchedDescription = description.match( /.*(close|closes|closed|fix|fixes|fixed|resolve|resolves|resolved) #(\d+)?.*/i );

	if ( matchedName ) {
		return matchedName[ 1 ];
	} else if ( matchedDescription ) {
		return matchedDescription[ 2 ];
	}

	return null;
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
	const parentIssueId = getParentIssue( pr.head.ref, pr.body );

	if ( !parentIssueId ) {
		return;
	}

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
