#!/usr/bin/env node
'use strict'; // eslint-disable-line strict
var files;

require( 'babel-register' );

/**
 * External dependencies
 */
const debug = require( 'debug' )( 'test-runner' ),
	glob = require( 'glob' ),
	Mocha = require( 'mocha' ),
	path = require( 'path' ),
	program = require( 'commander' ),
	chalk = require( 'chalk' );

/**
 * Internal dependencies
 */
const boot = require( './boot-test' ),
	utils = require( './utils.js' ),
	setup = require( './setup' );

program
	.usage( '[options] [files]' )
	.option( '-R, --reporter <name>', 'specify the reporter to use', 'spec' )
	.option( '-t, --node-total <n>', 'specify the node total to use', parseInt )
	.option( '-i, --node-index <n>', 'specify the node index to use', parseInt )
	.option( '-g, --grep <pattern>', 'only run tests matching <pattern>' )
	.option( '-w, --watch', 'watch files for changes' );

program.name = 'runner';

program.parse( process.argv );

let getMocha = function() {
	let mocha = new Mocha( {
		ui: 'bdd',
		reporer: program.reporter
	} );

	if ( program.grep ) {
		mocha.grep( new RegExp( program.grep ) );
	}

	mocha.suite.beforeAll( boot.before );
	mocha.suite.afterAll( boot.after );

	if ( process.env.CIRCLECI ) {
		debug( 'Hello Circle!' );
		// give circle more time by default because containers are slow
		// why 10 seconds? a guess.
		mocha.suite.timeout( 10000 );
	}

	let testSuiteLoaderPath = path.join( __dirname, 'load-suite.js' );
	// Mocha requires that you invalidate the cache in order to run a test-suite
	// more than once: https://github.com/mochajs/mocha/issues/995
	delete require.cache[ testSuiteLoaderPath ];
	mocha.addFile( testSuiteLoaderPath );

	return mocha;
};

files = program.args.length ? program.args : [ process.env.TEST_ROOT ];
files = files.reduce( ( memo, filePath ) => {
	// Validate test root matches specified file paths
	if ( ! filePath.startsWith( process.env.TEST_ROOT ) ) {
		console.warn(
			chalk.red.bold( 'WARNING:' ),
			chalk.yellow( 'Invalid argument passed to test runner. Paths must match test root `' + process.env.TEST_ROOT + '`.' )
		);
		console.warn( ' - ' + filePath + '\n' );

		return memo;
	}

	// Append individual file argument
	if ( /\.jsx?$/i.test( filePath ) ) {
		return memo.concat( filePath );
	}

	// Determine whether argument already includes intended test directory,
	// or if we should recursively search for test directories.
	let globPattern = '*.@(js|jsx)';
	if ( ! /\/test\/?$/.test( filePath ) ) {
		globPattern = path.join( '**/test', globPattern );
	}

	// Append discovered files from glob result
	return memo.concat( glob.sync( path.join( filePath, globPattern ) ) );
}, [] );

if ( program.nodeTotal > 1 ) {
	files = files.filter( ( file, index ) => {
		return index % program.nodeTotal === program.nodeIndex;
	} );
}

files.forEach( setup.addFile );

if ( program.watch ) {
	console.log( chalk.green( 'Watch mode enabled' ) );

	let runAgain = false;
	let runner = null;

	let rerun = () => {
		console.log( chalk.green( 'Running tests at: ' ),
									chalk.yellow( new Date( ) ) );
		runAgain = false;

		runner = getMocha().run( function( ) {
			runner = null;
			if ( runAgain ) {
				rerun();
			}
		} );
	};

	// start the first test-run independently of watch
	rerun();

	let watchFiles = utils.files( process.cwd( ), [ 'js', 'jsx' ] );
	utils.watch( watchFiles, () => {
		runAgain = true;
		if ( runner ) {
			runner.abort();
		} else {
			rerun();
		}
	} );
} else {
	getMocha().run( function( failures ) {
		process.on( 'exit', function() {
			process.exit( failures ); //eslint-disable-line no-process-exit
		} );
	} );
}

