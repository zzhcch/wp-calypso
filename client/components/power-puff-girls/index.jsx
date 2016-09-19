/**
 * External dependencies
 */
import React from 'react';
// import PureRenderMixin from 'react-pure-render/mixin';

export default React.createClass( {

	displayName: 'PowerPuff',

//	mixins: [ PureRenderMixin ],

/*
	randomImage() {
		let ppgImages = [ 'http://3.bp.blogspot.com/-ZSh6OGPAIlM/U5l4IPFEfKI/AAAAAAAAAvQ/YoqmKmhYagw/s1600/9.png', 'http://vignette4.wikia.nocookie.net/powerpuff/images/1/14/Buttercup-pic.png', 'http://vignette2.wikia.nocookie.net/powerpuff/images/e/e4/Bubbles_kicking.jpg' ];
		let ppgirlNumber = Math.floor( Math.random() * 3 );
		return {
			//	return ppgImages[ ppgirlNumber ];
			url: ppgImages[ ppgirlNumber ]
		};
	},
*/

	chooseGirl( girlName ) {
		if ( girlName === 'Blossom' ) {
			return 'http://3.bp.blogspot.com/-ZSh6OGPAIlM/U5l4IPFEfKI/AAAAAAAAAvQ/YoqmKmhYagw/s1600/9.png';
		} else if ( girlName === 'Buttercup' ) {
			return 'http://vignette4.wikia.nocookie.net/powerpuff/images/1/14/Buttercup-pic.png';
		} else if ( girlName === 'Bubbles' ) {
			return 'http://vignette2.wikia.nocookie.net/powerpuff/images/e/e4/Bubbles_kicking.jpg';
		}
	},

	render() {
		return (
			<img src={ this.chooseGirl( this.props.girlName ) } />
		);
	}
} );
