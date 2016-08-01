/**
 * External dependencies
 */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import FormToggle from '../';
import CompactFormToggle from '../compact';

describe( 'FormToggle', () => {
	it( 'should not have is-compact class', () => {
		const toggle = shallow( <FormToggle /> );

		expect( toggle ).to.not.match( '.is-compact' );
	} );

	it( 'should not be checked when checked is false', () => {
		const toggle = shallow( <FormToggle /> );

		expect( toggle ).to.have.prop( 'className' ).not.contain( 'is-checked' );
		expect( toggle.find( 'input' ) ).to.not.match( ':checked' );
	} );

	it( 'should be checked when checked is true', () => {
		const toggle = shallow( <FormToggle checked /> );

		expect( toggle ).to.have.prop( 'className' ).contain( 'is-checked' );
		expect( toggle.find( 'input' ) ).to.match( ':checked' );
	} );

	it( 'should not be disabled when disabled is false', () => {
		const toggle = shallow( <FormToggle /> );

		expect( toggle ).to.not.match( ':disabled' );
		expect( toggle.find( 'input' ) ).to.not.match( ':disabled' );
	} );

	it( 'should be disabled when disabled is true', () => {
		const toggle = shallow( <FormToggle disabled /> );

		expect( toggle ).to.match( ':disabled' );
		expect( toggle.find( 'input' ) ).to.match( ':disabled' );
	} );
} );

describe( 'CompactFormToggle', function() {
	it( 'should have is-compact class', function() {
		const toggle = shallow( <CompactFormToggle /> );

		expect( toggle ).to.match( '.is-compact' );
	} );
} );
