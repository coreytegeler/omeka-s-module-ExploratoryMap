<?php
namespace ExhibitsList;

use Omeka\Module\AbstractModule;
use ExhibitList\Form\ConfigForm;
use Zend\View\Model\ViewModel;
use Zend\Mvc\Controller\AbstractController;
use Zend\View\Renderer\PhpRenderer;

class Module extends AbstractModule
{
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

}