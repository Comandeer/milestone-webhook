const http = require( 'http' );
const createHandler = require( 'github-webhook-handler' );
const { handlePR } = require( './lib/lib' );
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

const handler = createHandler( {
	path: '/webhook',
	secret: process.env.GH_MSWH_SECRET
} );

http.createServer( ( req, res ) => {
	handler( req, res, () => {
		res.statusCode = 404;
		res.end( 'no such location' );
	} );
} ).listen( 3000 );

handler.on( 'error', ( err ) => {
	console.error( 'Error:', err.message ); // eslint-disable-line no-console
} );

handler.on( 'pull_request', ( evt ) => {
	handlePR( github, evt );
} );
