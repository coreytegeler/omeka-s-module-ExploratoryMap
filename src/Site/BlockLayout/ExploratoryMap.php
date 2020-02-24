<?php
namespace ExploratoryMap\Site\BlockLayout;

use Zend\Form\Element\Select;
use Zend\Form\Element\Text;
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
    public function getLabel()
    {
        return 'Exploratory Map'; // @translate
    }

    public function prepareForm(PhpRenderer $view)
    {
        $view->headLink()->appendStylesheet($view->assetUrl('css/exploratory-map-admin.css', 'ExploratoryMap'));
    }

    public function form(PhpRenderer $view, SiteRepresentation $site,
        SitePageRepresentation $page = null, SitePageBlockRepresentation $block = null
    ) {
        $html = '';
        $mapType = new Select("o:block[__blockIndex__][o:data][mapType]");

        $mapType->setValueOptions([
            'exploratory' => 'Exploratory',
            'story' => 'Story'
        ]);
    
        if ($block && $block->dataValue('mapType')) {
            $mapType->setAttribute('value', $block->dataValue('mapType'));
        } else {
            $mapType->setAttribute('value', 'exploratory');
        }

        $html .= '<div class="field"><div class="field-meta">';
        $html .= '<label>' . $view->translate('Map Type') . '</label>';
        $html .= '</div>';
        $html .= '<div class="inputs">' . $view->formRow($mapType) . '</div>';
        $html .= '</div>';

        $html .= $view->blockAttachmentsForm($block);
        
        return $html;
    }

    public function render(PhpRenderer $view, SitePageBlockRepresentation $block)
    {
        $view->headLink()->appendStylesheet($view->assetUrl('css/exploratory-map-public.css', 'ExploratoryMap'));
        $view->headScript()->appendFile($view->assetUrl('js/jquery-3.3.1.min.js', 'ExploratoryMap'), 'text/javascript');
        $view->headScript()->appendFile($view->assetUrl('js/mapbox-gl.js', 'ExploratoryMap'), 'text/javascript');
        $view->headScript()->appendFile($view->assetUrl('js/exploratory-map-public.js', 'ExploratoryMap'), 'text/javascript');

        $attachments = $block->attachments();
        if (!$attachments) {
            return '';
        }

        $markers = array();
        $markerIndex = 0;
        foreach ($attachments as $index => $attachment) {
            $item = $attachment->item();
            $locations = $view->api()->search(
                'mapping_markers',
                ['item_id' => $item->id()]
            )->getContent();
            $locationsArray = json_decode(json_encode($locations), true);
            if(!empty($locationsArray)) {
                foreach ($locationsArray as $location) {
                    $marker = array();
                    $marker['location'] = $location;
                    $media = $attachment->media() ?: $item->primaryMedia();
                    if ($media):
                        $marker['thumbnail'] =  $view->thumbnail($media, $view->thumbnailType);
                        $marker['filename'] = $media->displayTitle();
                    endif;
                    if ($item):
                        $marker['item'] = $item->id();
                    endif;
                    $marker['title'] = $item->displayTitle();
                    $marker['link'] = $item->link($item->displayTitle());
                    $markers[$markerIndex] = $marker;
                    $markerIndex++;
                }
            }
        }
        // print_r($marker);

        return $view->partial('common/block-layout/exploratory-map-block', [
            'block' => $block,
            'mapType' => $block->dataValue('mapType'),
            'markers' => $markers,
        ]);
    }
}