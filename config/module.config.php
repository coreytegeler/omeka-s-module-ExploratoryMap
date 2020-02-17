<?php
namespace ExhibitsList;
return [
    'block_layouts' => [
        'invokables' => [
            'exhibitsList' => 'ExhibitsList\Site\BlockLayout\ExhibitsList',
        ],
    ],
    'view_helpers' => [
        'factories' => [
            'blockAttachmentsForm' => Service\ViewHelper\ExhibitsList::class,
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            OMEKA_PATH . '/modules/ExhibitsList/view',
        ],
        'template_map' => [
            'omeka/site-admin/page/edit' => OMEKA_PATH . '/themes/view-from-ginling/view/omeka/site-admin/page/edit.phtml',
         ],
    ],

];
