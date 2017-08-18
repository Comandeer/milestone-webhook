'use strict';

function getParentIssue( name ) {
	return name.match( /t\/(\d+).*/ )[ 1 ];
}

function getBranchFromMilestone( milestone ) {
	if ( typeof milestone === 'string' && milestone.match( /\d+\.\d+\.0/ ) ) {
		return 'major';
	}

	return 'master';
}

function handlePR() {}

exports.getParentIssue = getParentIssue;
exports.getBranchFromMilestone = getBranchFromMilestone;
exports.handlePR = handlePR;
