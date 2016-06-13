import { watchFile, readdirSync, statSync } from 'fs';
import path from 'path';

/**
 * Ignored directories.
 */

var ignore = [ 'node_modules', '.git' ];

/**
 * Taken from: https://github.com/mochajs/mocha/blob/8a37e016e5629b46709891740c74d5f0b69929e0/lib/utils.js#L168
 *
 * Watch the given `files` for changes
 * and invoke `fn(file)` on modification.
 *
 * @param {Array} files the array of files
 * @param {Function} fn the function to call on modification
 */
exports.watch = function( files, fn ) {
	var options = { interval: 100 };
	files.forEach( function( file ) {
		watchFile( file, options, ( curr, prev ) => {
			if ( prev.mtime < curr.mtime ) {
				fn( file );
			}
		} );
	} );
};

/**
 * Taken from: https://github.com/mochajs/mocha/blob/8a37e016e5629b46709891740c74d5f0b69929e0/lib/utils.js
 *
 * Ignored files.
 *
 * @param {string} fp file path
 * @return {boolean} true if should ignore
 */
function ignored( fp ) {
	return ! ~ignore.indexOf( fp );
}

/**
 * Taken from: https://github.com/mochajs/mocha/blob/8a37e016e5629b46709891740c74d5f0b69929e0/lib/utils.js
 *
 * Lookup files in the given `dir`.
 *
 * @param {string} dir directory to lookup
 * @param {string[]} [ext=['.js']] file extensions to accept
 * @param {Array} [ret=[]] array to mutate with results
 * @return {Array} of files
 */
exports.files = function( dir, ext, ret ) {
	ret = ret || [ ];
	ext = ext || [ 'js' ];

	let re = new RegExp( '\\.(' + ext.join( '|' ) + ')$' );

	readdirSync( dir )
		.filter( ignored )
		.forEach( ( fp ) => {
			fp = path.join( dir, fp );
			if ( statSync( fp ).isDirectory( ) ) {
				exports.files( fp, ext, ret );
			} else if ( fp.match( re ) ) {
				ret.push( fp );
			}
		} );

	return ret;
};
