/**
 * External dependencies
 */
import get from 'lodash/get';
import memoize from 'lodash/memoize';
import startsWith from 'lodash/startsWith';

/**
 * Internal dependencies
 */
import { isSectionLoading } from 'state/ui/selectors';
import createSelector from 'lib/create-selector';
import guidedToursConfig from 'layout/guided-tours/config';

const getToursConfig = memoize( ( tour ) => guidedToursConfig.get( tour ) );

/**
 * Returns the current state for Guided Tours.
 *
 * This includes the raw state from state/ui/guidedTour, but also the available
 * configuration (`stepConfig`) for the currently active tour step, if one is
 * active.
 *
 * @param  {Object}  state Global state tree
 * @return {Object}        Current Guided Tours state
 */
const getRawGuidedTourState = state => get( state, 'ui.guidedTour', false );

const getTourTriggers = state => get( state, 'ui.tourTriggers', [] );

const tourCandidates = [
	{
		name: 'themes',
		test: ( { type, path } ) =>
			type === 'SET_ROUTE' && startsWith( path, '/design' ),
	},
];

const findEligibleTour = createSelector(
		state => {
			let allTours = guidedToursConfig.getAll();
			allTours = Object.keys( allTours ).map( ( key ) => {
				const tour = allTours[ key ];
				return {
					name: key,
					...tour,
				};
			} );
			console.log( allTours );
			let tourName = false;

			allTours.some( ( tour ) => {
				console.log( 'testing tour: ', tour );
				if ( tour.showInContext( state ) ) {
					tourName = tour.name;
					return true;
				}
			} );
			return tourName;
		},
		state => [
			getTourTriggers( state ),
		]
);

export const getGuidedTourState = createSelector(
	state => {
		const tourState = getRawGuidedTourState( state );
		console.log( '******** previous tourState', tourState );
		const { stepName = 'init' } = tourState;
		let { tour } = tourState;

		if ( ! tour ) {
			console.log( 'no tour, finding one' );
			tour = findEligibleTour( state );
			console.log( 'found', tour );
		}

		if ( ! tour ) {
			console.log( 'no tour -- returning early' );
			return tourState;
		}

		console.log( 'getting data for tour', tour );
		const tourConfig = getToursConfig( tour );
		console.log( 'tourConfig', tourConfig );
		const stepConfig = tourConfig[ stepName ] || false;
		console.log( 'stepConfig', stepConfig );
		const nextStepConfig = getToursConfig( tour )[ stepConfig.next ] || false;

		console.log( 'tour', tour );

		return Object.assign( {}, tourState, {
			stepConfig,
			nextStepConfig,
			tour,
		} );
	},
	state => [
		getRawGuidedTourState( state ),
		isSectionLoading( state ),
		getTourTriggers( state ),
	]
);
