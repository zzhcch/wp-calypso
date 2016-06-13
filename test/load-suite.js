const setup = require( 'setup' );

// Mocha requires you to invalidate cache if you want to run the same test
// more than once: https://github.com/mochajs/mocha/issues/995
function requireUncached( module ) {
	delete require.cache[ require.resolve( module ) ];
	return require( module );
}

function requireTestFiles( config, path = '' ) {
	Object.keys( config ).forEach( ( folderName ) => {
		const folderConfig = config[ folderName ];

		if ( folderName === 'test' && Array.isArray( folderConfig ) ) {
			folderConfig.forEach( fileName => requireUncached( `${path}test/${fileName}` ) );
		} else {
			describe( folderName, () => {
				requireTestFiles( folderConfig, `${path}${folderName}/` );
			} );
		}
	} );
}

requireTestFiles( setup.getConfig() );
