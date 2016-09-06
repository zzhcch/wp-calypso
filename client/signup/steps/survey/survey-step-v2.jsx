/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import StepWrapper from 'signup/step-wrapper';
import SignupActions from 'lib/signup/actions';
import analytics from 'lib/analytics';
import verticals from './verticals';
import Button from 'components/button';
import Card from 'components/card';
import Gridicon from 'components/gridicon';
import FormTextInput from 'components/forms/form-text-input';

export default React.createClass( {
	displayName: 'SurveyStepV2',

	propTypes: {
		surveySiteType: React.PropTypes.string
	},

	getDefaultProps() {
		return {
			surveySiteType: 'site'
		};
	},

	getInitialState() {
		return {
			shouldShowOther: false,
			otherQuery: '',
			verticalList: verticals.get(),
			otherVerticalList: verticals.getOther(),
		};
	},

	renderVertical( vertical ) {
		return (
			<Button className="survey__vertical" onClick={ this.handleNextStep }>
				<span className="survey__vertical-label">{ vertical.label }</span>
				<Gridicon className="survey__vertical-chevron" icon="chevron-right" />
			</Button>
		);
	},

	renderOtherListItem( item ) {
		return <Card href="#" compact className="survey__vertical-other-card" >{ item.label }</Card>;
	},

	renderOtherList() {
		if ( this.state.otherQuery === '' ) {
			return;
		}
		let query = this.state.otherQuery.toLowerCase();
		return this.state.otherVerticalList
			.filter( ( item ) => {
				return item.label.toLowerCase().indexOf( query ) !== -1 ||
					( item.synonyms && item.synonyms.toLowerCase().indexOf( query ) !== -1 );
			} )
			.slice( 0, 6 )
			.map( this.renderOtherListItem );
	},

	renderOther() {
		return <div className="survey__vertical-other">
			<FormTextInput
				className="survey__vertical-other-text-field"
				ref={ this.handleOtherTextFieldRef }
				placeholder={ this.translate( 'Please describe your site' ) }
				onChange={ this.handleOtherTextFieldChange }
			/>
			{ this.renderOtherList() }
		</div>
	},

	renderOptionList() {
		return (
			<div className="survey__verticals-list">
				{ this.state.verticalList.map( this.renderVertical ) }
				<Button className="survey__vertical" onClick={ this.handleOther }>
					<span className="survey__vertical-label">{ this.translate( 'Other' ) }</span>
					<Gridicon className="survey__vertical-chevron" icon="chevron-right" />
				</Button>
			</div>
		);
	},

	render() {
		const blogHeaderText = this.translate( 'Create your blog today!' );
		const siteHeaderText = this.translate( 'Create your site today!' );
		return (
			<StepWrapper
					flowName={ this.props.flowName }
					stepName={ this.props.stepName }
					positionInFlow={ this.props.positionInFlow }
					headerText={ this.props.surveySiteType === 'blog' ? blogHeaderText : siteHeaderText }
					subHeaderText={ this.translate( 'WordPress.com is the best place for your WordPress blog or website.' ) }
					signupProgressStore={ this.props.signupProgressStore }
					stepContent={ this.state.shouldShowOther ? this.renderOther() : this.renderOptionList() } />
		);
	},

	handleOther() {
		this.setState( {
			shouldShowOther: true
		} );
	},

	handleNextStep( vertical ) {
		const { value, label } = vertical;
		analytics.tracks.recordEvent( 'calypso_survey_site_type', { type: this.props.surveySiteType } );
		analytics.tracks.recordEvent( 'calypso_survey_category_chosen', {
			category_id: value,
			category_label: label
		} );
		SignupActions.submitSignupStep(
			{ stepName: this.props.stepName },
			[],
			{ surveySiteType: this.props.surveySiteType, surveyQuestion: vertical.value }
		);
		this.props.goToNextStep();
	},

	handleOtherTextFieldRef( input ) {
		if ( input && input.refs && input.refs.textField ) {
			input.refs.textField.focus();
		}
	},

	handleOtherTextFieldChange( e ) {
		this.setState( {
			otherQuery: e.target.value
		} );
	}
} );
