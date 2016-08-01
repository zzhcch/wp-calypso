/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { omit } from 'lodash';

export default function FormToggle( props ) {
	const { checked, onChange, disabled, compact, className } = props;
	const classes = classNames( 'form-toggle', className, {
		'is-checked': checked,
		'is-compact': compact
	} );

	return (
		<button
			{ ...omit( props, 'checked', 'onChange', 'compact' ) }
			type="button"
			role="checkbox"
			onClick={ onChange }
			aria-checked={ checked }
			className={ classes }>
			<input
				type="checkbox"
				checked={ checked }
				disabled={ disabled }
				readOnly
				className="form-toggle__input" />
		</button>
	);
}

FormToggle.propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	compact: PropTypes.bool,
	className: PropTypes.string
};

FormToggle.defaultProps = {
	checked: false
};
