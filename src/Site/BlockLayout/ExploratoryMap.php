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
        $view->headLink()->appendStylesheet($view->assetUrl('css/exploratory-map-admin-styles.css', 'ExploratoryMap'));
    }

    public function form(PhpRenderer $view, SiteRepresentation $site,
        SitePageRepresentation $page = null, SitePageBlockRepresentation $block = null
    ) {
        $html = '';
        $mapbox = new Text("o:block[__blockIndex__][o:data][mapbox]");

        if ($block) {
            $mapbox->setAttribute('value', $block->dataValue('mapbox'));
        }

        $html .= '<div class="field"><div class="field-meta">';
        $html .= '<label>' . $view->translate('Mapbox') . '</label>';
        $html .= '<a href="#" class="expand"></a>';
        $html .= '<div class="collapsible"><div class="field-description">' . $view->translate('Enter Mapbox URL') . '</div></div>';
        $html .= '</div>';
        $html .= '<div class="inputs">' . $view->formRow($mapbox) . '</div>';
        $html .= '</div>';

        $html .= $view->blockAttachmentsForm($block);
        
        return $html;
    }

    public function render(PhpRenderer $view, SitePageBlockRepresentation $block)
    {
        $view->headLink()->appendStylesheet($view->assetUrl('css/exploratory-map-public-styles.css', 'ExploratoryMap'));
        $view->headScript()->appendFile($view->assetUrl('js/jquery-3.3.1.min.js', 'ExploratoryMap'), 'text/javascript');
        $view->headScript()->appendFile($view->assetUrl('js/mapbox-gl.js', 'ExploratoryMap'), 'text/javascript');
        $view->headScript()->appendFile($view->assetUrl('js/exploratory-map-scripts.js', 'ExploratoryMap'), 'text/javascript');

        $attachments = $block->attachments();
        if (!$attachments) {
            return '';
        }

        $markers = array();
        foreach ($attachments as $index => $attachment) {
            $marker = array();
            $lat = $block->dataValue($index)['lat'];
            $lng = $block->dataValue($index)['lng'];
            $marker['lat'] = $lat;
            $marker['lng'] = $lng;
            $marker['caption'] = $attachment->caption();
            $item = $attachment->item();
            $media = $attachment->media() ?: $item->primaryMedia();
            if ($media):
                $marker['thumbnail'] =  $view->thumbnail($media, $view->thumbnailType);
                $marker['filename'] = $media->displayTitle();
            endif;
            $marker['title'] = $item->displayTitle();
            $marker['link'] = $item->link($item->displayTitle());
            $markers[$index] = $marker;
        }

        return $view->partial('common/block-layout/exploratory-map-block', [
            'block' => $block,
            'attachments' => $attachments,
            'markers' => $markers
        ]);
    }

//     public function install(ServiceLocatorInterface $serviceLocator)
//     {
//         $conn = $serviceLocator->get('Omeka\Connection');
//         $conn->exec('
// CREATE TABLE custom_map (id INT AUTO_INCREMENT NOT NULL, item_id INT NOT NULL, media_id INT DEFAULT NULL, lat DOUBLE PRECISION NOT NULL, lng DOUBLE PRECISION NOT NULL, `label` VARCHAR(255) DEFAULT NULL, INDEX IDX_667C9244126F525E (item_id), INDEX IDX_667C9244EA9FDD75 (media_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;
// CREATE TABLE mapping (id INT AUTO_INCREMENT NOT NULL, item_id INT NOT NULL, bounds VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_49E62C8A126F525E (item_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;
// ALTER TABLE mapping_marker ADD CONSTRAINT FK_667C9244126F525E FOREIGN KEY (item_id) REFERENCES item (id) ON DELETE CASCADE;
// ALTER TABLE mapping_marker ADD CONSTRAINT FK_667C9244EA9FDD75 FOREIGN KEY (media_id) REFERENCES media (id) ON DELETE SET NULL;
// ALTER TABLE mapping ADD CONSTRAINT FK_49E62C8A126F525E FOREIGN KEY (item_id) REFERENCES item (id) ON DELETE CASCADE;');
//     }

//     public function uninstall(ServiceLocatorInterface $serviceLocator)
//     {
//         $conn = $serviceLocator->get('Omeka\Connection');
//         $conn->exec('DROP TABLE IF EXISTS custom_map');
//     }
}
