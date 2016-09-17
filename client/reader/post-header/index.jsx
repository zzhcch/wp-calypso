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



function returnRandom () {

var ppg = ["http://calypso.localhost:3000/assets/ppp.jpg", "http://calypso.localhost:3000/assets/ppp1.jpg", "http://calypso.localhost:3000/assets/ppp2.jpg"];

var ppgNumber = Math.floor(Math.random() * 3);

return ppg[ppgNumber]

}

const PostHeader = ( { site, siteUrl, showFollow, onSiteSelect, onSiteClick } ) => (
	<div className="reader__post-header">
		{ showFollow ? <FollowButton siteUrl={ siteUrl } /> : null }
		<Site site={ site }
			href={ siteUrl }
			onSelect={ onSiteSelect }
			onClick={ onSiteClick } />
			<img src={returnRandom()} />
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
