/**
 * External dependencies
 */
import debugFactory from 'debug';
import request from 'superagent';
import to_latin from 'cyrillic-to-latin';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import userSettings from 'lib/user-settings';
import i18nUtils from 'lib/i18n-utils';

const debug = debugFactory( 'calypso:i18n' );

const localeVariants = {
	init() {
		const localeVariant = userSettings.getSetting( 'locale_variant' );
		switch ( localeVariant ) {
			case 'de_formal':
				debug( 'Adding new translations for ' + localeVariant );
				this.addTranslations( localeVariant );
				break;
			case 'sr_latin':
				debug( 'Applying mods for ' + localeVariant );
				i18n.registerTranslateHook( ( translation ) => {
					return this.cyrillicToLatin( translation );
				} );
				i18n.reRenderTranslations();
				break;
		}
	},

	cyrillicToLatin( translation ) {
		switch ( typeof( translation ) ) {
			case 'object':
				for ( let prop in translation ) {
					if ( typeof prop === 'string' ) {
						prop = to_latin( prop );
					}
				}
				break;
			case 'string':
				translation = to_latin( translation );
				break;
		}

		return translation;
	},

	addTranslations( localeVariantSlug ) {
		request.get( i18nUtils.languageFileUrl( localeVariantSlug ) ).end( function( error, response ) {
			if ( error ) {
				debug( 'Encountered an error loading locale file for ' + localeVariantSlug );
				return;
			}
			i18n.addTranslations( response.body );
		} );
	}
};

userSettings.on( 'change', localeVariants.init.bind( localeVariants ) );
export default localeVariants;
