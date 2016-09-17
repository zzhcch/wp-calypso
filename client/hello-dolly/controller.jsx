/**
 * External Dependencies
 */
import React from 'react';
import ReactDom from 'react-dom';

/**
 * Internal Dependencies
 */
import Hello from './main';

export function helloDolly() {
	ReactDom.render(
		<Hello name="Dolly" />,
		document.getElementById( 'primary' )
	);
}

export function hello( context ) {
	const { name } = context.params;
	ReactDom.render(
		<Hello name={ name } />,
		document.getElementById( 'primary' )
	);
}
