<?php

/*
---------------------------------------
License Setup
---------------------------------------
Please add your license key, which you've received
via email after purchasing Kirby on http://getkirby.com/buy

It is not permitted to run a public website without a
valid license key. Please read the End User License Agreement
for more information: http://getkirby.com/license

Note: license moved to seperate file  
(https://forum.getkirby.com/t/license-in-config-php-and-deployment/1132)
*/

$license = __DIR__ . DS . 'license.php';

if (file_exists($license)) {
  include $license;
}

/*
---------------------------------------
Kirby Configuration
---------------------------------------
By default you don't have to configure anything to
make Kirby work. For more fine-grained configuration
of the system, please check out http://getkirby.com/docs/advanced/options
*/

// ---------------------------------------
// MISC
// ---------------------------------------

// Add Markdown Extra
c::set('markdown.extra', true);
// Debug mode
c::set('debug',true);


// ---------------------------------------
// PATTERNS CONFIG
// ---------------------------------------
c::set('patterns.title', 'Patterns');
c::set('patterns.path', 'patterns');
c::set('patterns.directory', '/Users/Mike/Web_work/htdocs/mikejfraser.com/site/patterns');
c::set('patterns.lock', false);
c::set('patterns.preview.css', 'assets/css/styles.css');
c::set('patterns.preview.js', 'assets/js/main.js');
c::set('patterns.preview.background', false);


// ---------------------------------------
// RESPONSIVE IMG CONFIG
// ---------------------------------------

// default
c::set('responsiveimages.defaultsource', 'small');
// max size for inline images
c::set('responsiveimages.inlinemax', 'xlarge');
// Source Sizes
c::set('responsiveimages.sources', array( 
	// standard
	'small'  => array('width' => 350),
	'smallish'  => array('width' => 500),
	'medium' => array('width' => 700),
	'large'  => array('width' => 900),
	'xlarge'  => array('width' => 1200),
	'max'  => array('width' => 1600),
	// project listing
	'sq_small'  => array('width' => 400,'height' => 400, 'crop' => true),
	'sq_med'  => array('width' => 600,'height' => 600, 'crop' => true),
	'sq_large' => array('width' => 800,'height' => 800, 'crop' => true)
));
// MQ sizes
c::set('responsiveimages.sizes', array( 
	array(
		'size_value' => '33.5rem',
		'mq_value'   => '500px',
		'mq_name'    => 'min-width'
	),
	array(
		'size_value' => '100vw'
	)
));