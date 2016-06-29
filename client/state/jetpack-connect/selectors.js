const JETPACK_CONNECT_TTL = 60 * 60 * 1000; // an hour

const isCalypsoStartedConnection = function( state, siteSlug ) {
	const site = siteSlug.replace( /.*?:\/\//g, '' );
	if ( state && state[ site ] ) {
		const currentTime = ( new Date() ).getTime();
		return ( currentTime - state[ site ].timestamp < JETPACK_CONNECT_TTL );
	}

	return false;
};

const hasVisitedJetpackConnect = function( state ) {
	if ( state.jetpackConnect.flags ) {
		return state.jetpackConnect.flags.visited;
	}
	return false;
};

export default { isCalypsoStartedConnection, hasVisitedJetpackConnect };
