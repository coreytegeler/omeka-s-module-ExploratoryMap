<?php
namespace ExploratoryMap\Site\BlockLayout;

use Zend\Form\Element\Select;
use Zend\Form\Element\Text;
use Zend\Form\Element\Textarea;
use Omeka\Form\Element\ResourceSelect;
use Omeka\Form\Element\ItemSetSelect;
use Omeka\Api\Representation\SiteRepresentation;
use Omeka\Api\Representation\SitePageRepresentation;
use Omeka\Api\Representation\SitePageBlockRepresentation;
use Omeka\Entity\SitePageBlock;
use Omeka\Site\BlockLayout\AbstractBlockLayout;
use Omeka\Stdlib\ErrorStore;
use Zend\View\Renderer\PhpRenderer;
use Zend\ServiceManager\ServiceLocatorInterface;

class ExploratoryMap extends AbstractBlockLayout
{

	public function handleMapValues( $values, $default )
	{
		$arr = array();
		$valuesSplit = preg_split( '/\r\n|\n|\r/', $values );

		if( $values && is_array( $valuesSplit ) ) {
			foreach( $valuesSplit as $key => $value ) {
				$valueArr = explode( ' : ', $value );
				$arr[] = array(
					'name' => $valueArr[0],
					'url' => trim( $valueArr[1], ' ' )
				);
			}
		} else {
			$arr[] = array(
				'name' => 'Default',
				'url' => $default
			);
		}
		return $arr;
	}


	public function getLabel()
	{
		return 'Exploratory Map'; // @translate
	}

	public function prepareForm(PhpRenderer $view)
	{
		$view->headLink()->appendStylesheet($view->assetUrl('exploratory-map-admin.css', 'ExploratoryMap'));
	}

	public function form(PhpRenderer $view, SiteRepresentation $site, SitePageRepresentation $page = null, SitePageBlockRepresentation $block = null
	) {
		$html = '';

		// Map Type Select
		$mapTypeSelect = new Select("o:block[__blockIndex__][o:data][mapType]");
		$mapTypeSelect->setOptions([
			'label' => 'Mapbox Type',
			'info' => '',
		]);
		$mapTypeSelect->setValueOptions([
			'exploratory' => 'Exploratory',
			'story' => 'Story',
			'layered' => 'Layered',
		]);
		$mapTypeValue = $block ? $block->dataValue('mapType') : null;
		$mapTypeSelect->setAttributes([
			'value' => $mapTypeValue
		]);
		$html .= $view->formRow($mapTypeSelect);

		// Basemaps
		$basemapsInput = new Textarea("o:block[__blockIndex__][o:data][basemaps]");
		$basemapsInput->setOptions([
			'label' => 'Basemaps',
			'info' => 'Enter each basemap on a new line. Specify both a value and label like this: Map Name : url://abc',
		]);
		$basemapsValue = $block ? $block->dataValue('basemaps') : null;
		$basemapsInput->setAttributes([
			'value' => $basemapsValue
		]);
		$html .= $view->formRow($basemapsInput);


		// Map Styles
		$overlaysInput = new Textarea("o:block[__blockIndex__][o:data][overlays]");
		$overlaysInput->setOptions([
			'label' => 'Map Overlays',
			'info' => 'Enter each map overlay on a new line. Specify both a value and label like this: Overlay Name : url://abc',
		]);
		$overlaysValue = $block ? $block->dataValue('overlays') : null;
		$overlaysInput->setAttributes([
			'value' => $overlaysValue
		]);
		$html .= $view->formRow($overlaysInput);

		// Access Token
		$accessTokenInput = new Text("o:block[__blockIndex__][o:data][accessToken]");
		$accessTokenInput->setOptions([
			'label' => 'Mapbox Access Token',
			'info' => '',
		]);
		$accessTokenValue = $block ? $block->dataValue('accessToken') : null;
		$accessTokenInput->setAttributes([
			'value' => $accessTokenValue
		]);
		$html .= $view->formRow($accessTokenInput);

		// Location Attachments Form
		$html .= $view->blockAttachmentsForm($block);
		
		return $html;

	}

	public function render(PhpRenderer $view, SitePageBlockRepresentation $block)
	{
		$prod = $_SERVER['HTTP_HOST'] != 'localhost';
		$dep_file_name = 'exploratory-map-public' . ( $prod ? '.min' : '' );

		$view->headLink()->appendStylesheet($view->assetUrl($dep_file_name . '.css', 'ExploratoryMap'));
		$view->headScript()->appendFile($view->assetUrl('jquery-3.3.1.min.js', 'ExploratoryMap'), 'text/javascript');
		$view->headScript()->appendFile($view->assetUrl('mapbox-gl.js', 'ExploratoryMap'), 'text/javascript');
		$view->headScript()->appendFile($view->assetUrl($dep_file_name . '.js', 'ExploratoryMap'), 'text/javascript');

		$attachments = $block->attachments();
		if (!$attachments) {
			return '';
		}

		$markers = array();
		$markerIndex = 0;

		foreach( $attachments as $index => $attachment ) {
			$item = $attachment->item();
			$marker = array();
			$marker['title'] = $item->displayTitle();
			$marker['link'] = $item->link( $item->displayTitle() );
			if( $item ) {
				$marker['item'] = $item->id();
			}
			if( $item->value( 'dcterms:type' ) ) {
				$marker['type'] = $item->value( 'dcterms:type' )->value();
			}

			if( $item->value( 'dcterms:spatial' ) ) {
				$marker['coords'] = $item->value( 'dcterms:spatial' )->value();
			}
			$locations = $view->api()->search(
				'mapping_markers',
				['item_id' => $item->id()]
			)->getContent();
			$locationsArray = json_decode( json_encode( $locations ), true );
			if( sizeof( $locationsArray ) ) {
				$location = $locationsArray[0];
				$marker['location'] = $location;
			}
			$media = $attachment->media() ?: $item->primaryMedia();
			if( $media ) {
				$marker['thumbnail'] =  $view->thumbnail( $media, $view->thumbnailType );
				$marker['filename'] = $media->displayTitle();
			}
			$markers[$index] = $marker;
		}
	

		return $view->partial('common/block-layout/exploratory-map-block', [
			'block' => $block,
			'mapType' => $block->dataValue('mapType'),
			'accessToken' => $block->dataValue('accessToken'),
			'basemaps' => $this->handleMapValues( $block->dataValue( 'basemaps' ), 'mapbox://styles/mapbox/light-v9' ),
			'overlays' => $this->handleMapValues( $block->dataValue( 'overlays' ), null ),
			'markers' => $markers,
		]);
	}

}