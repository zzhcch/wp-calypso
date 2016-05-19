/**
 * External Dependencies
 */
var React = require( 'react' );

/**
 * Internal dependencies
 */
var SectionNav = require( 'components/section-nav' ),
	BlankSlate = require( 'components/blank-slate' ),
	NavTabs = require( 'components/section-nav/tabs' ),
	NavItem = require( 'components/section-nav/item' ),
	siteStatsStickyTabActions = require( 'lib/site-stats-sticky-tab/actions' );

module.exports = React.createClass( {
	propTypes: {
		section: React.PropTypes.string.isRequired,
		site: React.PropTypes.oneOfType( [
			React.PropTypes.bool,
			React.PropTypes.object
		] )
	},

	componentDidMount: function() {
		var slug = this.props.site ? this.props.site.slug : '';
		siteStatsStickyTabActions.saveFilterAndSlug( this.props.section, slug );
	},

	componentDidUpdate: function() {
		var slug = this.props.site ? this.props.site.slug : '';
		siteStatsStickyTabActions.saveFilterAndSlug( this.props.section, slug );
	},

	render: function() {
		var activeSection = this.props.section,
			siteFragment = this.props.site ? '/' + this.props.site.slug : '',
			sectionTitles = {
				insights: this.translate( 'Insights' ),
				day: this.translate( 'Days' ),
				week: this.translate( 'Weeks' ),
				month: this.translate( 'Months' ),
				year: this.translate( 'Years' )
			};

		return (
			<div>
				<BlankSlate>
					<h1>Welcome to Stats</h1>
					<p>Your stats page includes a bunch of nifty graphs, charts, and lists that show you how many visits your site gets, what posts and pages are the most popular ones, and much more.</p>
					<p><a href="https://support.wordpress.com/stats/">Learn more</a></p>
				</BlankSlate>

				<SectionNav selectedText={ sectionTitles[ activeSection ] }>
					<NavTabs label={ this.translate( 'Stats' ) }>
						<NavItem path={ '/stats/insights' + siteFragment } selected={ activeSection === 'insights' }>{ sectionTitles.insights }</NavItem>
						<NavItem path={ '/stats/day' + siteFragment } selected={ activeSection === 'day' }>{ sectionTitles.day }</NavItem>
						<NavItem path={ '/stats/week' + siteFragment } selected={ activeSection === 'week' }>{ sectionTitles.week }</NavItem>
						<NavItem path={ '/stats/month' + siteFragment } selected={ activeSection === 'month' }>{ sectionTitles.month }</NavItem>
						<NavItem path={ '/stats/year' + siteFragment } selected={ activeSection === 'year' }>{ sectionTitles.year }</NavItem>
					</NavTabs>
				</SectionNav>
			</div>
		);
	}
} );
