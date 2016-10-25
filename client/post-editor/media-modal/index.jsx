/**
 * External dependencies
 */
import React, { Component, PropTypes } from 'react';
import noop from 'lodash/noop';
import head from 'lodash/head';
import some from 'lodash/some';
import findIndex from 'lodash/findIndex';
import values from 'lodash/values';
import closest from 'component-closest';
import debugFactory from 'debug';
import { localize } from 'i18n-calypso';
const debug = debugFactory( 'calypso:post-editor:media' );

/**
 * Internal dependencies
 */
import MediaLibrary from 'my-sites/media-library';
import analytics from 'lib/analytics';
import PostActions from 'lib/posts/actions';
import { recordStat, recordEvent } from 'lib/posts/stats';
import MediaModalSecondaryActions from './secondary-actions';
import MediaModalDetail from './detail';
import MediaModalGallery from './gallery';
import MediaActions from 'lib/media/actions';
import MediaUtils from 'lib/media/utils';
import Dialog from 'components/dialog';
import markup from './markup';
import accept from 'lib/accept';
import { Views as ModalViews } from './constants';
import ImageEditor from 'blocks/image-editor';

class EditorMediaModal extends Component {
	static propTypes = {
		visible: PropTypes.bool,
		initialActiveView: PropTypes.oneOf( values( ModalViews ) ),
		mediaLibrarySelectedItems: PropTypes.arrayOf( PropTypes.object ),
		onClose: PropTypes.func,
		onInsertMedia: PropTypes.func,
		site: PropTypes.object,
		labels: PropTypes.object,
		single: PropTypes.bool,
		defaultFilter: PropTypes.string,
		enabledFilters: PropTypes.arrayOf( PropTypes.string ),
		translate: PropTypes.func.isRequired,
	};

	static defaultProps = {
		visible: false,
		mediaLibrarySelectedItems: Object.freeze( [] ),
		onClose: noop,
		onInsertMedia: noop,
		labels: Object.freeze( {} )
	};

	constructor( props ) {
		super( props );

		this.state = this.getDefaultState( this.props );

		// bounds
		this.onAddMedia = this.onAddMedia.bind( this );
		this.onAddAndEditImage = this.onAddAndEditImage.bind( this );
		this.onClose = this.onClose.bind( this );
		this.onFilterChange = this.onFilterChange.bind( this );
		this.onImageEditorCancel = this.onImageEditorCancel.bind( this );
		this.onScaleChange = this.onScaleChange.bind( this );
		this.onSearch = this.onSearch.bind( this );

		this.confirmDeleteMedia = this.confirmDeleteMedia.bind( this );
		this.confirmSelection = this.confirmSelection.bind( this );
		this.deleteMedia = this.deleteMedia.bind( this );
		this.preventClose = this.preventClose.bind( this );
		this.setDetailSelectedIndex = this.setDetailSelectedIndex.bind( this );
		this.setView = this.setView.bind( this );
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.site && this.props.visible && ! nextProps.visible ) {
			MediaActions.setLibrarySelectedItems( nextProps.site.ID, [] );
		}

		if ( ! nextProps.visible || this.props.visible === nextProps.visible ) {
			return;
		}

		this.setState( this.getDefaultState( nextProps ) );
	}

	componentDidMount() {
		debug( '%s component mounted.', this.constructor.name );

		this.statsTracking = {};
	}

	getDefaultState( props ) {
		return {
			filter: '',
			activeView: props.initialActiveView || ModalViews.LIST,
			detailSelectedIndex: 0,
			gallerySettings: props.initialGallerySettings
		};
	}

	isDisabled() {
		return some( this.props.mediaLibrarySelectedItems, function( item ) {
			const mimePrefix = MediaUtils.getMimePrefix( item );
			return item.transient && ( mimePrefix !== 'image' || ModalViews.GALLERY === this.state.activeView );
		}.bind( this ) );
	}

	confirmSelection() {
		const selectedItems = this.props.mediaLibrarySelectedItems;
		const gallerySettings = this.state.gallerySettings;

		if ( ! this.props.visible ) {
			return null;
		}

		let media, stat;

		if ( ModalViews.GALLERY === this.state.activeView ) {
			if ( gallerySettings && 'individual' === gallerySettings.type ) {
				media = gallerySettings.items.map( markup.get ).join( '' );
			} else {
				media = MediaUtils.generateGalleryShortcode( gallerySettings );
			}
			stat = 'insert_gallery';
		} else {
			media = selectedItems.map( markup.get ).join( '' );
			stat = 'insert_item';
		}

		if ( some( selectedItems, 'transient' ) ) {
			PostActions.blockSave( 'MEDIA_MODAL_TRANSIENT_INSERT' );
		}

		if ( media ) {
			this.props.onInsertMedia( media );

			if ( stat ) {
				analytics.mc.bumpStat( 'editor_media_actions', stat );
			}
		}

		this.props.onClose( selectedItems );
	}

	setView( activeView ) {
		this.setState( { activeView } );

		let stat;

		switch ( activeView ) {
			case ModalViews.LIST: stat = 'view_list'; break;
			case ModalViews.DETAIL: stat = 'view_detail'; break;
			case ModalViews.GALLERY: stat = 'view_gallery'; break;
			case ModalViews.IMAGE_EDITOR: stat = 'view_edit'; break;
		}

		if ( stat ) {
			analytics.mc.bumpStat( 'editor_media_actions', stat );
		}
	}

	setDetailSelectedIndex( index ) {
		this.setState( {
			detailSelectedIndex: index
		} );
	}

	setNextAvailableDetailView() {
		if ( 1 === this.props.mediaLibrarySelectedItems.length ) {
			// If this is the only selected item, return user to the list
			this.setView( ModalViews.LIST );
		} else if ( this.getDetailSelectedIndex() === this.props.mediaLibrarySelectedItems.length - 1 ) {
			// If this is the last selected item, decrement to the previous
			this.setDetailSelectedIndex( Math.max( this.getDetailSelectedIndex() - 1, 0 ) );
		}
	}

	confirmDeleteMedia( accepted ) {
		const { site, mediaLibrarySelectedItems } = this.props;

		if ( ! site || ! accepted ) {
			return;
		}

		let toDelete = mediaLibrarySelectedItems;
		if ( ModalViews.DETAIL === this.state.activeView ) {
			toDelete = toDelete[ this.getDetailSelectedIndex() ];
			this.setNextAvailableDetailView();
		}

		MediaActions.delete( site.ID, toDelete );
		analytics.mc.bumpStat( 'editor_media_actions', 'delete_media' );
	}

	deleteMedia() {
		let selectedCount;

		if ( ModalViews.DETAIL === this.state.activeView ) {
			selectedCount = 1;
		} else {
			selectedCount = this.props.mediaLibrarySelectedItems.length;
		}

		const confirmMessage = this.props.translate(
			'Are you sure you want to permanently delete this item?',
			'Are you sure you want to permanently delete these items?',
			{ count: selectedCount }
		);

		accept( confirmMessage, this.confirmDeleteMedia );
	}

	onAddMedia() {
		recordStat( 'media_explorer_upload' );
		recordEvent( 'Upload Media' );
	}

	onAddAndEditImage() {
		MediaActions.setLibrarySelectedItems( this.props.site.ID, [] );

		this.setView( ModalViews.IMAGE_EDITOR );
	}

	onImageEditorDone( error, blob, imageEditorProps, media ) {
		if ( error ) {
			this.onImageEditorCancel( imageEditorProps );

			return;
		}

		const {
			fileName,
			site,
			resetAllImageEditorState
		} = imageEditorProps;

		const mimeType = MediaUtils.getMimeType( fileName );

		const item = {
			ID: media.ID,
			media: {
				fileName: fileName,
				fileContents: blob,
				mimeType: mimeType
			}
		};

		MediaActions.update( site.ID, item );

		resetAllImageEditorState();

		MediaActions.setLibrarySelectedItems( this.props.site.ID, [] );
		this.setView( ModalViews.LIST );
	}

	onImageEditorCancel( imageEditorProps ) {
		const { mediaLibrarySelectedItems } = this.props;

		const item = mediaLibrarySelectedItems[ this.getDetailSelectedIndex() ];

		if ( ! item ) {
			this.setView( ModalViews.LIST );
			return;
		}
		this.setView( ModalViews.DETAIL );

		const {	resetAllImageEditorState } = imageEditorProps;

		resetAllImageEditorState();
	}

	getDetailSelectedIndex() {
		const { mediaLibrarySelectedItems } = this.props;
		const { detailSelectedIndex } = this.state;
		if ( detailSelectedIndex >= mediaLibrarySelectedItems.length ) {
			return 0;
		}
		return detailSelectedIndex;
	}

	onFilterChange( filter ) {
		if ( filter !== this.state.filter ) {
			analytics.mc.bumpStat( 'editor_media_actions', 'filter_' + ( filter || 'all' ) );
		}

		this.setState( { filter } );
	}

	onScaleChange() {
		if ( ! this.statsTracking.scale ) {
			analytics.mc.bumpStat( 'editor_media_actions', 'scale' );
			this.statsTracking.scale = true;
		}
	}

	onSearch( search ) {
		this.setState( {
			search: search || undefined
		} );

		if ( ! this.statsTracking.search ) {
			analytics.mc.bumpStat( 'editor_media_actions', 'search' );
			this.statsTracking.search = true;
		}
	}

	onClose() {
		this.props.onClose();
	}

	editItem( item ) {
		const { site, mediaLibrarySelectedItems, single } = this.props;
		if ( ! site ) {
			return;
		}

		// Append item to set of selected items if not already selected.
		let items = mediaLibrarySelectedItems;
		if ( ! items.some( ( selected ) => selected.ID === item.ID ) ) {
			if ( single ) {
				items = [ item ];
			} else {
				items = items.concat( item );
			}
			MediaActions.setLibrarySelectedItems( site.ID, items );
		}

		// Find and set detail selected index for the edited item
		this.setDetailSelectedIndex( findIndex( items, { ID: item.ID } ) );

		analytics.mc.bumpStat( 'editor_media_actions', 'edit_button_contextual' );
		analytics.ga.recordEvent( 'Media', 'Clicked Contextual Edit Button' );

		this.setView( ModalViews.DETAIL );
	}

	getFirstEnabledFilter() {
		if ( this.props.enabledFilters ) {
			return head( this.props.enabledFilters );
		}
	}

	getModalButtons() {
		const isDisabled = this.isDisabled();
		const selectedItems = this.props.mediaLibrarySelectedItems;

		if ( ModalViews.IMAGE_EDITOR === this.state.activeView ) {
			return;
		}

		const buttons = [
			<MediaModalSecondaryActions
				site={ this.props.site }
				selectedItems={ selectedItems }
				activeView={ this.state.activeView }
				disabled={ isDisabled }
				onDelete={ this.deleteMedia }
				onChangeView={ this.setView } />,
			{
				action: 'cancel',
				label: this.props.translate( 'Cancel' )
			}
		];

		if (
			ModalViews.GALLERY !== this.state.activeView &&
			selectedItems.length > 1 &&
			! some( selectedItems, ( item ) => MediaUtils.getMimePrefix( item ) !== 'image' )
		) {
			buttons.push( {
				action: 'confirm',
				label: this.props.translate( 'Continue' ),
				isPrimary: true,
				disabled: isDisabled || ! this.props.site,
				onClick: this.setView.bind( this, ModalViews.GALLERY )
			} );
		} else {
			buttons.push( {
				action: 'confirm',
				label: this.props.labels.confirm || this.props.translate( 'Insert' ),
				isPrimary: true,
				disabled: isDisabled || 0 === selectedItems.length,
				onClick: this.confirmSelection
			} );
		}

		return buttons;
	}

	preventClose( event ) {
		if ( ModalViews.IMAGE_EDITOR === this.state.activeView ||
			closest( event.target, '.popover.is-dialog-visible' ) ) {
			return true;
		}
	}

	renderContent() {
		let content;

		switch ( this.state.activeView ) {
			case ModalViews.LIST:
				content = (
					<MediaLibrary
						site={ this.props.site }
						filter={ this.state.filter || this.props.defaultFilter || this.getFirstEnabledFilter() }
						enabledFilters={ this.props.enabledFilters }
						search={ this.state.search }
						onAddMedia={ this.onAddMedia }
						onAddAndEditImage={ this.onAddAndEditImage }
						onFilterChange={ this.onFilterChange }
						onScaleChange={ this.onScaleChange }
						onSearch={ this.onSearch }
						onEditItem={ this.editItem }
						fullScreenDropZone={ false }
						single={ this.props.single }
						scrollable />
				);
				break;

			case ModalViews.DETAIL:
				const setView = () => this.setView( ModalViews.IMAGE_EDITOR );

				content = (
					<MediaModalDetail
						site={ this.props.site }
						items={ this.props.mediaLibrarySelectedItems }
						selectedIndex={ this.getDetailSelectedIndex() }
						onSelectedIndexChange={ this.setDetailSelectedIndex }
						onChangeView={ this.setView }
						onEdit={ setView } />
				);
				break;

			case ModalViews.GALLERY:
				const setGallerySettings = ( gallerySettings ) => this.setState( { gallerySettings } );

				content = (
					<MediaModalGallery
						site={ this.props.site }
						items={ this.props.mediaLibrarySelectedItems }
						settings={ this.state.gallerySettings }
						onUpdateSettings={ setGallerySettings }
						onChangeView={ this.setView } />
				);
				break;

			case ModalViews.IMAGE_EDITOR:
				const {
					site,
					mediaLibrarySelectedItems: items
				} = this.props;

				const selectedIndex = this.getDetailSelectedIndex(),
					media = items ? items[ selectedIndex ] : null;

				const imageEditionIsDone = ( error, blob, imageEditorProps ) => {
					this.onImageEditorDone( error, blob, imageEditorProps, media );
				};

				content = (
					<ImageEditor
						siteId={ site && site.ID }
						media={ media }
						onDone={ imageEditionIsDone }
						onCancel={ this.onImageEditorCancel }
					/>
				);
				break;
		}

		return content;
	}

	render() {
		return (
			<Dialog
				isVisible={ this.props.visible }
				buttons={ this.getModalButtons() }
				onClose={ this.onClose }
				additionalClassNames="editor-media-modal"
				onClickOutside={ this.preventClose }>
				{ this.renderContent() }
			</Dialog>
		);
	}
}

export default localize( EditorMediaModal );
