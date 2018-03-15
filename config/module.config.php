<?php
return [
    'block_layouts' => [
        'invokables' => [
            'customMap' => 'ExploratoryMap\Site\BlockLayout\ExploratoryMap'
        ],
    ],
    'view_manager' => [
        'template_path_stack' => [
            OMEKA_PATH . '/modules/ExploratoryMap/view',
        ],
    ],
];
