module.exports = function() {
	this.cacheable();

	return `
/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import AsyncLoad from 'components/async-load';

export default function( props ) {
	return <AsyncLoad require="${ this.resourcePath }" { ...props } />;
}`;
};
