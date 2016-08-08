/**
 * External dependencies
 */
var React = require( 'react' ),
	debug = require( 'debug' )( 'calypso:my-sites:current-site' );

import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
var AllSites = require( 'my-sites/all-sites' ),
	analytics = require( 'lib/analytics' ),
	Button = require( 'components/button' ),
	Card = require( 'components/card' ),
	layoutFocus = require( 'lib/layout-focus' ),
	Site = require( 'blocks/site' ),
	Gridicon = require( 'components/gridicon' ),
	UpgradesActions = require( 'lib/upgrades/actions' ),
	DomainsStore = require( 'lib/domains/store' ),
	DomainWarnings = require( 'my-sites/upgrades/components/domain-warnings' );

import SiteNotice from './notice';
import { getSelectedSite, getSelectedSiteId } from 'state/ui/selectors';
import { getSites } from 'state/sites/selectors';

export const CurrentSite = React.createClass( {
	componentDidMount: function() {
		debug( 'The current site React component is mounted.' );
	},

	propTypes: {
		sites: React.PropTypes.object.isRequired,
		siteCount: React.PropTypes.number.isRequired
	},

	componentWillMount: function() {
		const selectedSite = this.getSelectedSite();

		if ( selectedSite ) {
			UpgradesActions.fetchDomains( selectedSite.ID );
		}
		this.prevSelectedSite = selectedSite;

		DomainsStore.on( 'change', this.handleStoreChange );
	},

	componentWillUnmount: function() {
		DomainsStore.off( 'change', this.handleStoreChange );
	},

	getInitialState: function() {
		return {
			domainsStore: DomainsStore
		};
	},

	componentWillUpdate() {
		const selectedSite = this.getSelectedSite();

		if ( selectedSite && this.prevSelectedSite !== selectedSite ) {
			UpgradesActions.fetchDomains( selectedSite.ID );
		}
		this.prevSelectedSite = selectedSite;
	},

	handleStoreChange: function() {
		this.setState( { domainsStore: DomainsStore } );
	},

	switchSites: function( event ) {
		event.preventDefault();
		event.stopPropagation();
		layoutFocus.set( 'sites' );
		if ( this.refs.site ) {
			this.refs.site.closeActions();
		}

		analytics.ga.recordEvent( 'Sidebar', 'Clicked Switch Site' );
	},

	getSelectedSite: function() {
		if ( this.props.sites.length === 1 ) {
			return this.props.sites[ 0 ];
		}

		return this.props.selectedSite || false;
	},

	getDomainExpirationNotices: function() {
		let domainStore = this.state.domainsStore.getBySite( this.getSelectedSite().ID ),
			domains = domainStore && domainStore.list || [];
		return (
			<DomainWarnings
				selectedSite={ this.getSelectedSite() }
				domains={ domains }
				ruleWhiteList={ [ 'expiredDomains', 'expiringDomains' ] } />
		);
	},

	getSiteNotices: function() {
		return (
			<div>
				{ this.getDomainExpirationNotices() }
			</div>
		);
	},

	previewSite: function( event ) {
		analytics.ga.recordEvent( 'Sidebar', 'Clicked View Site' );
		this.props.onClick && this.props.onClick( event );
	},

	render: function() {
		const site = this.getSelectedSite();

		if ( ! this.props.sites.length ) {
			return (
				<Card className="current-site is-loading">
					{ this.props.siteCount > 1 &&
						<span className="current-site__switch-sites">&nbsp;</span>
					}
					<div className="site">
						<a className="site__content">
							<div className="site-icon" />
							<div className="site__info">
								<span className="site__title">{ this.translate( 'Loading My Sites…' ) }</span>
							</div>
						</a>
					</div>
				</Card>
			);
		}

		return (
			<Card className="current-site">
				{ this.props.siteCount > 1 &&
					<span className="current-site__switch-sites">
						<Button compact borderless onClick={ this.switchSites }>
							<Gridicon icon="arrow-left" size={ 18 } />
							{ this.translate( 'Switch Site' ) }
						</Button>
					</span>
				}
				{ this.props.selectedSite
					? <Site
						site={ site }
						homeLink={ true }
						enableActions={ true }
						externalLink={ true }
						onClick={ this.previewSite }
						onSelect={ this.previewSite }
						tipTarget="site-card-preview"
						ref="site" />
					: <AllSites sites={ this.props.sites } />
				}
				{ this.getSiteNotices( site ) }
				<SiteNotice site={ site } />
			</Card>
		);
	}
} );

export default connect( ( state ) => ( {
	selectedSite: getSelectedSite( state ),
	selectedSiteId: getSelectedSiteId( state ),
	sites: getSites( state ),
} ), { } )( CurrentSite );
