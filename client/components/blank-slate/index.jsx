/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classnames from 'classnames';
import noop from 'lodash/noop';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';
import Button from 'components/button';

export default React.createClass( {
	displayName: 'Blank Slate',

	getDefaultProps() {
		return {
			className: ''
		};
	},

	propTypes: {
		className: PropTypes.string
	},

	getInitialState() {
		return{
			dismissed: false,
		};
	},

	slateDismiss() {
		//this.props.dismissed = ! this.props.dismissed;
		this.setState( {
			dismissed: ! this.state.dismissed
		} );
	},

	render() {
		let blankSlateClass = classnames( 'blank-slate' );

		if ( this.state.dismissed ) {
			blankSlateClass = classnames( 'blank-slate', 'dismissed' );
		}

		return (
			<div className={ classnames( this.props.className, blankSlateClass ) }>
				<div className="blank-slate__illustration">
					<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><title>Artboard</title><g fill="none" fill-rule="evenodd"><circle fill="#D2DCE4" cx="40.042" cy="40" r="39.944"/><path fill="#8FACBF" d="M15.555 34.755h14.052V65.28H15.555zM32.863 18.783h14.052V65.28H32.863z"/><path fill="#485566" opacity=".08" d="M39.89 18.727h7.025V65.28H39.89z"/><path fill="#8FACBF" d="M50.17 26.797h14.052V65.28H50.17z"/><path fill="#485566" opacity=".08" d="M22.692 34.755h6.915V65.28h-6.915zM57.252 26.74h6.957v38.54H57.25z"/><g fill="#647A88" opacity=".4"><path d="M40.417 50.017l-3.826 2.727-2.378-2.045c-.11.152-.222.32-.32.486l-1.03-.654v2.81l.488.32c.194 2.213 2.03 3.938 4.285 3.938 2.38 0 4.313-1.934 4.313-4.313 0-.71-.167-1.364-.473-1.948l5.426-8.237V38.79L40.03 49.197l.39.82zM61.245 41.6l-.167-1.6c-.195.21-.36.417-.515.654L54.9 36.327c.168-.25.307-.515.432-.793l-3.297-2.296h-1.878v4.745c.39.11.793.18 1.21.18.57 0 1.113-.11 1.614-.32l6.916 5.287c.11 2.268 1.96 4.077 4.257 4.105v-5.148l-2.908-.487zM25.67 44.202l-7.792.278-.473-.25c.125.417.306.793.53 1.14l-2.38 2.38v3.353l4.188-4.174c.542.25 1.14.388 1.78.388.627 0 1.225-.14 1.767-.39l6.303 4.022v-2.81l-4.438-2.825c.222-.348.39-.724.515-1.113z"/></g><path d="M64.167 44.202l-13.134-9.976L37.44 53.802l-16.863-11.27L4.37 57.962c6.58 13.036 20.075 21.982 35.672 21.982 22.066 0 39.944-17.878 39.944-39.944 0-5.732-1.224-11.186-3.395-16.11L64.168 44.2z" fill="#FFF" opacity=".17"/><path d="M75.743 22.08L63.89 41.224l-13.4-10.24L37.287 50.99 20.8 40.488 4.007 57.224c.362.752.75 1.49 1.155 2.2l15.972-15.918 16.863 10.74 13.078-19.84L64.53 44.69l12.395-20.036c-.362-.863-.75-1.725-1.182-2.574z" fill="#647A88"/><ellipse fill="#FFF" cx="37.635" cy="52.494" rx="3.506" ry="3.506"/><ellipse fill="#FFF" cx="21.523" cy="42.532" rx="3.506" ry="3.506"/><path d="M21.523 39.04v6.998c1.934 0 3.507-1.572 3.507-3.506 0-1.934-1.573-3.492-3.507-3.492zM37.635 48.988v6.998c1.934 0 3.506-1.572 3.506-3.506 0-1.92-1.57-3.492-3.505-3.492z" fill="#F0F3F4"/><ellipse fill="#FFF" cx="51.381" cy="33.461" rx="3.506" ry="3.506"/><path d="M51.38 29.97v6.997c1.935 0 3.507-1.572 3.507-3.506 0-1.933-1.572-3.49-3.506-3.49z" fill="#F0F3F4"/><ellipse fill="#FFF" cx="64.209" cy="42.532" rx="3.506" ry="3.506"/><path d="M64.167 39.04v6.998c1.934 0 3.506-1.572 3.506-3.506 0-1.934-1.572-3.492-3.506-3.492z" fill="#F0F3F4"/></g></svg>
				</div>
				<div className="blank-slate__content">
					{ this.props.children }
					<Button onClick={ this.slateDismiss }>Got it, thanks!</Button>
				</div>
			</div>
		);
	}
} );
