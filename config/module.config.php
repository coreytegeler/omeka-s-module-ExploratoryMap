<?php
return [
    'block_layouts' => [
        'invokables' => [
            'exploratoryMap' => 'ExploratoryMap\Site\BlockLayout\ExploratoryMap',
        ],
    ],
    'view_helpers' => [
        'factories' => [
            // 'blockAttachmentsForm' => Service\ViewHelper\ExploratoryMap::class,
            // 'locationsBlockAttachmentsForm' => 'ExploratoryMap\View\Helper\LocationsBlockAttachmentsForm',
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            OMEKA_PATH . '/modules/ExploratoryMap/view',
        ],
    ],

];
