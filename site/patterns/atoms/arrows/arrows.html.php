<?php
// Direction links
// Parameters:
// dir -> direction - if 'nextPrev', will produce two links
// url -> link location - array of two locations if 'nextPrev'
// text -> text for link - array of two strings if 'nextPrev'

if ( $dir !== 'prevNext' ):

$class = 'ar ar_'.$dir[0].$dir[ strlen($dir) - 1 ]; ?>

<a href="<?= $url ?>" class="<?= $class ?>"><?= $text ?></a>

<?php elseif ( $dir === 'prevNext' ) : ?>

<div class="ar_lr">
	<a href="<?= $url[0] ?>" class="ar ar_lt"><?= $text[0] ?></a>
	<a href="<?= $url[1] ?>" class="ar ar_rt"><?= $text[1] ?></a>
</div>

<?php endif ?>