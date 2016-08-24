/**
 * External dependencies
 */
import React, { Component } from 'react';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';
import { abtest } from 'lib/abtest';

export default class PlanFeaturesItem extends Component {
	constructor( props ) {
		super( props );

		this.handleOnTouchStart = ( event ) => {
			this.props.onTouchStart( event.currentTarget, this.props.description );
		};

		this.handleOnMouseEvent = () => {
			this.props.onMouseEnter( this.refs.descriptionDetailsIcon, this.props.description );
		};

		this.handleOnMouseLeave = () => {
			this.props.onMouseLeave( this.refs.descriptionDetailsIcon, this.props.description );
		};

		this.mouseEvents = {
			onMouseEnter: this.handleOnMouseEvent,
			onMouseLeave: this.handleOnMouseLeave
		};
		this.hoverOnRow = (
			abtest( 'plansDescriptions' ) === 'ascendingPriceEagerDescription' ||
			abtest( 'plansDescriptions' ) === 'descendingPriceEagerDescription'
		);
	}

	render() {
		return (
			<div className="plan-features__item"
				{ ...( this.hoverOnRow && this.mouseEvents ) }
			>
				<Gridicon
					className="plan-features__item-checkmark"
					size={ 18 } icon="checkmark" />
				{ this.props.children }
				<span
					ref="descriptionDetailsIcon"
					{ ...( ! this.hoverOnRow && this.mouseEvents ) }
					onTouchStart={ this.handleOnTouchStart }
					className="plan-features__item-tip-info"
				>
					<Gridicon icon="info-outline" size={ 18 } />
				</span>
			</div>
		);
	}
}
