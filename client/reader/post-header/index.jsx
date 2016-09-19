/**
 * External dependencies
 */
import React from 'react';
import noop from 'lodash/noop';

/**
 * Internal dependencies
 */
import Site from 'blocks/site';
import FollowButton from 'reader/follow-button';

function randomImage() {
	let ppgImages = [ 'http://3.bp.blogspot.com/-ZSh6OGPAIlM/U5l4IPFEfKI/AAAAAAAAAvQ/YoqmKmhYagw/s1600/9.png', 'http://www.internationalhero.co.uk/p/ppblossom.jpg', 'http://vignette2.wikia.nocookie.net/powerpuff/images/e/e4/Bubbles_kicking.jpg' ];
	let ppgirlNumber = Math.floor( Math.random() * 3 );
	return ppgImages[ ppgirlNumber ];
}

const PostHeader = ( { site, siteUrl, showFollow, onSiteSelect, onSiteClick } ) => (

	<div className="reader__post-header">
		{ showFollow ? <FollowButton siteUrl={ siteUrl } /> : null }

		<img id="ppg" src={ randomImage() } />

		<Site site={ site }
			href={ siteUrl }
			onSelect={ onSiteSelect }
			onClick={ onSiteClick } />
	</div>
);

PostHeader.propTypes = {
	site: React.PropTypes.object,
	siteUrl: React.PropTypes.string,
	showFollow: React.PropTypes.bool,
	onSiteSelect: React.PropTypes.func,
	onSiteClick: React.PropTypes.func
};

PostHeader.defaultProps = {
	showFollow: false,
	onSiteSelect: noop,
	onSiteClick: noop
};

export default PostHeader;
