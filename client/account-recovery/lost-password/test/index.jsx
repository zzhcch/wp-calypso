/**
 * External dependencies
 */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import reactTapEventPlugin from 'react-tap-event-plugin';
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import useFakeDom from 'test/helpers/use-fake-dom';
import { LostPassword } from '..';

describe( 'LostPassword', () => {
	it( 'should render as expected', () => {
		const wrapper = shallow( <LostPassword className="test__test" translate={ noop } /> );

		expect( wrapper ).to.have.className( 'lost-password__container' );
		expect( wrapper ).to.have.className( 'test__test' );
		expect( wrapper ).to.have.state( 'isSubmitting' ).to.be.false;
		expect( wrapper.find( '.lost-password__user-login-input' ).prop( 'disabled' ) ).to.not.be.ok;
		expect( wrapper.find( '.lost-password__submit-button' ).prop( 'disabled' ) ).to.not.be.ok;
	} );

	context( 'events', () => {
		reactTapEventPlugin();
		useFakeDom();

		it( 'should not submit if user login is blank', function() {
			const wrapper = mount( <LostPassword className="test__test" translate={ noop } /> );

			wrapper.find( '.lost-password__user-login-input' ).node.value = '';
			wrapper.find( '.lost-password__user-login-input' ).simulate( 'change' );
			wrapper.find( '.lost-password__submit-button' ).simulate( 'click' );

			expect( wrapper ).to.have.state( 'isSubmitting' ).to.be.false;
			expect( wrapper.find( '.lost-password__user-login-input' ).prop( 'disabled' ) ).to.not.be.ok;
			expect( wrapper.find( '.lost-password__submit-button' ).prop( 'disabled' ) ).to.not.be.ok;
		} );

		it( 'should be disabled when submit button clicked', function() {
			const wrapper = mount( <LostPassword className="test__test" translate={ noop } /> );

			wrapper.find( '.lost-password__user-login-input' ).node.value = 'test';
			wrapper.find( '.lost-password__user-login-input' ).simulate( 'change' );
			wrapper.find( '.lost-password__submit-button' ).simulate( 'click' );

			expect( wrapper ).to.have.state( 'isSubmitting' ).to.be.true;
			expect( wrapper.find( '.lost-password__user-login-input' ).prop( 'disabled' ) ).to.be.ok;
			expect( wrapper.find( '.lost-password__submit-button' ).prop( 'disabled' ) ).to.be.ok;
		} );
	} );
} );
