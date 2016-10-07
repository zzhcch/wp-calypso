import yargs from 'yargs';
import { execSync } from 'child_process';
import fs from 'fs';

const { argv } = yargs
  .usage( 'Usage: $0 <command> [options]' )
  .help( 'h' )
  .alias( 'h', 'help' )
  .string( 'host-dir' )
  .array( 'plugins' )
  .default( 'plugins', [] );

function plugins( argv ) {
  return argv.plugins;
}

const hostDir = argv['host-dir'];
const hostPackage = JSON.parse( fs.readFileSync( `${ hostDir }/package.json` ) );
const hostModules = fs.readdirSync( `${ hostDir }/node_modules` );

if ( 'wp-calypso' === hostPackage.name ) {
  console.log( 'This is meant to be called from a parent package.' )
  process.exit( 1 );
}

process.chdir( 'node_modules' );

plugins( argv ).forEach( ( plugin ) => {
  try {
    fs.unlinkSync( plugin );
  } catch ( e ) {
    console.log( e );
  }
  try {
    fs.symlinkSync( `${ hostDir }/node_modules/${ plugin }`, plugin );
  } catch ( e ) {
    console.log( e );
  }
} );

process.chdir( '..' );

execSync( 'make run', { stdio: 'inherit' } );
