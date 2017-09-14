
<?php
// Will contain all icons.
// Parameters:
// icon -> icon name
// type -> button / link location
// text -> alt text for icon

if ( $type === 'button' ):
	$iconStart 	= 'button ';
	$iconEnd 	= '</button>';
else:
	$iconStart 	= 'a href="' . $type . '" ';
	$iconEnd 	= '</a>';
endif;
?>


<<?= $iconStart ?> class="ic ic-<?= $icon ?>">
<svg viewBox="0 0 30 30" class="ic_svg">
<use xlink:href="<?= kirby()->urls()->assets() . '/svg/icons.svg#' . $icon ?>"></use></svg>
<span class="ic_text"><?= $text ?></span><?= $iconEnd ?>