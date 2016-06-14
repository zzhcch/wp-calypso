#!/usr/bin/env node
'use strict'; // eslint-disable-line strict
var testFiles;

require( 'babel-register' );

/**
 * External dependencies
 */
const debug = require( 'debug' )( 'test-runner' ),
	glob = require( 'glob' ),
	Mocha = require( 'mocha' ),
	path = require( 'path' ),
	program = require( 'commander' ),
	watchFile = require( 'fs' ).watchFile,
	chalk = require( 'chalk' );

program
	.usage( '[options] [files]' )
	.option( '-R, --reporter <name>', 'specify the reporter to use', 'spec' )
	.option( '-t, --node-total <n>', 'specify the node total to use', parseInt )
	.option( '-i, --node-index <n>', 'specify the node index to use', parseInt )
	.option( '-g, --grep <pattern>', 'only run tests matching <pattern>' )
	.option( '-w, --watch', 'watch files for changes' );

program.name = 'runner';

program.parse( process.argv );

const getMocha = function() {
	/* These internal dependencies are not at the top of the file
	 * because we need to re-require them every time we invalidate the cache.
	 *
	 * We invalidate the cache because Mocha has trouble running a test-suite
	 * more than once:  https://github.com/mochajs/mocha/issues/995
	 */
	Object.keys( require.cache ).forEach( ( key ) => {
		delete require.cache[ key ];
	} );
	const boot = require( './boot-test' );
	const setup = require( './setup' );

	const mocha = new Mocha( {
		ui: 'bdd',
		reporer: program.reporter
	} );

	mocha.suite.beforeAll( boot.before );
	mocha.suite.afterAll( boot.after );

	if ( program.grep ) {
		mocha.grep( new RegExp( program.grep ) );
	}

	if ( process.env.CIRCLECI ) {
		debug( 'Hello Circle!' );
		// give circle more time by default because containers are slow
		// why 10 seconds? a guess.
		mocha.suite.timeout( 10000 );
	}

	testFiles.forEach( setup.addFile );
	mocha.addFile( path.join( __dirname, 'load-suite.js' ) );
	return mocha;
};

testFiles = program.args.length ? program.args : [ process.env.TEST_ROOT ];
testFiles = testFiles.reduce( ( memo, filePath ) => {
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
	testFiles = testFiles.filter( ( file, index ) => {
		return index % program.nodeTotal === program.nodeIndex;
	} );
}

let runner = null;
const runMocha = () => {
	console.log( chalk.green( 'Running tests at: ' ),
		chalk.yellow( new Date() ) );

	runner = getMocha().run( () => {
		runner = null;
	} );
};

if ( program.watch ) {
	console.log( chalk.green( 'Watch mode enabled' ) );

	const watchFiles = glob.sync( '**/*.@(js|jsx)', { ignore: 'node_modules/**' } );
	const options = { interval: 100 };
	watchFiles.forEach( ( file ) => {
		watchFile( file, options, () => {
			if ( runner ) {
				runner.abort();
			}
			// aborting is not instant, so wait for it to finish
			// then call run the test-suite again
			let abortedCheck = setInterval( () => {
				if ( runner == null ) {
					clearInterval( abortedCheck );
					runMocha();
				}
			}, 25 );
		} );
	} );
}

runMocha();

