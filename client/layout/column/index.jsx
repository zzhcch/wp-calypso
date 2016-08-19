/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classnames from 'classnames';

function Column( { children, width, className } ) {
	const classes = classnames( 'column', className );
	return (
		<div className={ classes } style={ { maxWidth: width } }>{ children }</div>
	);
}

Column.propTypes = {
	width: PropTypes.number,
	className: PropTypes.string
};

export default Column;
