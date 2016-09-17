/**
 * External Dependencies
 */
import page from 'page';

/**
 * Internal Dependencies
 */
import { helloDolly, hello } from './controller';

export default function() {
	page( '/hello-dolly', helloDolly );
	page( '/hello/:name', hello );
}
