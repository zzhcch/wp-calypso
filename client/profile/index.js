/**
 * External Dependencies
 */
import page from 'page';

/**
 * Internal Dependencies
 */
import { userProfile } from './controller';

export default function() {
	page( '/profile/:user', userProfile );
}
