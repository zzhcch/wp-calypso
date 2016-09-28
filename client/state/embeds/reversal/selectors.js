export function getEmbedReversals( state, siteId ) {
	return state.embeds.reversal.items[ siteId ] || {};
}

export function getEmbedReversalResult( state, siteId, markup ) {
	return getEmbedReversals( state, siteId )[ markup ] || null;
}
