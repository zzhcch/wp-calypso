/**
* External dependencies
*/
import React from 'react';
import PureRenderMixin from 'react-pure-render/mixin';

/**
* Internal dependencies
*/
import DocsExample from 'components/docs-example';
import InfoPopover from 'components/info-popover';

var InfoPopoverExample = React.createClass( {
	displayName: 'InfoPopover',

	mixins: [ PureRenderMixin ],

	getInitialState: function() {
		return {
			popoverPosition: 'bottom left',
		};
	},

	render: function() {
		return (
			<DocsExample
				title="Info Popover"
				url="/devdocs/design/info-popover"
				componentUsageStats={ this.props.componentUsageStats }
			>
				<label>Position
					<select value={ this.state.popoverPosition } onChange={ this._changePopoverPosition }>
						<option value="top">top</option>
						<option value="top left">top left</option>
						<option value="top right">top right</option>
						<option value="left">left</option>
						<option value="right">right</option>
						<option value="bottom">bottom</option>
						<option value="bottom left">bottom left</option>
						<option value="bottom right">bottom right</option>
					</select>
				</label>

				<br />

				<InfoPopover position={ this.state.popoverPosition }>
					Some informational text.
				</InfoPopover>
			</DocsExample>
		);
	},

	_changePopoverPosition: function( event ) {
		this.setState( { popoverPosition: event.target.value } );
	}

} );

module.exports = InfoPopoverExample;
