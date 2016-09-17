/**
 * External Dependencies
 */
import React from 'react';

/**
 * Internal Dependencies
 */
import Main from 'components/main';
import Greeting from 'components/greeting';

const names = [
	'Pants',
	'Bears',
	'Sky'
];

function HelloDollyMain( { name } ) {
	return (
		<Main className="hello-dolly">
			<Greeting name={ name } />
			<ul>
			{
				names.map( name => {
					return (
						<li key={ name }>
							<a href={ `/hello/${ name }` }>{ name }</a>
						</li> );
				} )
			}
			</ul>
		</Main>
	);
}

export default HelloDollyMain;
