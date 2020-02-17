<?php
namespace ExhibitsList\Site\BlockLayout;

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

class ExhibitsList extends AbstractBlockLayout
{
    public function getLabel()
    {
        return 'Exhibits List'; // @translate
    }

    public function prepareForm(PhpRenderer $view)
    {
        // $view->headLink()->appendStylesheet($view->assetUrl('css/exhibits-list-admin.css', 'ExhibitsList'));
    }

    public function form(PhpRenderer $view, SiteRepresentation $site,
        SitePageRepresentation $page = null, SitePageBlockRepresentation $block = null
    ) {
        $html = '';
        return $html;
    }

    public function render(PhpRenderer $view, SitePageBlockRepresentation $block)
    {

        return $view->partial('common/block-layout/exhibits-list-block', [
            'block' => $block,
        ]);
    }
}