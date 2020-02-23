<?php
namespace ExploratoryMap;
return [
    'block_layouts' => [
        'invokables' => [
            'exploratoryMap' => 'ExploratoryMap\Site\BlockLayout\ExploratoryMap',
        ],
    ],
    'view_helpers' => [
        'factories' => [
            'blockAttachmentsForm' => Service\ViewHelper\ExploratoryMap::class,
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            OMEKA_PATH . '/modules/ExploratoryMap/view',
        ],
        'template_map' => [
            'omeka/site-admin/page/edit' => OMEKA_PATH . '/themes/view-from-ginling/view/omeka/site-admin/page/edit.phtml',
         ],
    ],

];
