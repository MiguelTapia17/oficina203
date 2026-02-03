<?php get_header(); ?>
<?php get_template_part( 'templates/header', 'single' ); ?>

<div class="bloque6">
  <div class="bloque6Container">
    <div class="bloque6Calendar">
      <div class="bloque6CalendarProgress">
		<?php
			// Obtiene los parámetros UTM de la URL actual
			$utm_params = '';
			if (isset($_SERVER['QUERY_STRING']) && !empty($_SERVER['QUERY_STRING'])) {
				$query_string = $_SERVER['QUERY_STRING'];
				// Revisa si hay al menos un parámetro UTM
				if (strpos($query_string, 'utm_') !== false) {
					$utm_params = '?' . $query_string;
				}
			}

			// Crea el enlace completo del logo
			$home_url_with_utm = home_url() . $utm_params;
		?>
        <h5 onclick="window.open('<?= $home_url_with_utm; ?>')">Blog Cayetano</h5>
        <h5>|</h5>
        <h5 onclick="window.open('<?php home_url(); ?>')">Blog Pregrado</h5>
      </div>
      <div class="bloque6CalendarInfo">
        <img src="https://blogs.cayetano.edu.pe/wp-content/uploads/2025/11/calendar-icon-whit.png" alt="">
        <h3><?= get_the_date() ?></h3>
      </div>
      <div class="bloque6Title">
        <h1 id="first"><?= get_the_title(); ?></h1>
      </div>
      <div class="bloque6Item">
        <?php 
          $tags = wp_get_post_tags($post->ID);
          $tag_ids = array();
        ?>
        <?php if( $tags ): ?>
          <?php  foreach ($tags as $tag): ?>
		  	<?php $color = get_term_meta($tag->term_id, JC_PREFIX.'TAXC_bg', true ); ?>
            <?php $tag_ids[] = $tag->term_id;  ?>
            <h4 class="bloque6ItemSalud" style="background-color:<?= $color ? $color: '#ff0c29'; ?>" ><?= $tag->name; ?></h4>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>

<main class="bloque7 bloque7Individual">
  <?php
  if ( have_posts() ) :
    while ( have_posts() ) : the_post(); ?>

      <article <?php post_class('bloque7Container bloque7ContainerIndividual'); ?>>
        <div class="bloque7Left">
          <div class="bloque6Flex">
            <div class="bloque6Left">
              <?php if ( has_post_thumbnail() ): ?>
                <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>'','loading' => 'lazy', 'style' => 'height:auto;' )); ?>
              <?php endif; ?>
              <div class="bloque6LeftRedes">
                <h3>Compartir en redes:</h3>
                <div class="bloque6LeftRedesContent">
<!--                   <img src="<?= JC_THEME; ?>/assets/img/icon-fb.webp" alt="" onclick="window.open(`https://www.facebook.com/sharer/sharer.php?u=<?= get_the_permalink(); ?>`, '_self')">
                  <img src="<?= JC_THEME; ?>/assets/img/icon-wp.webp" alt="" onclick="window.open(`https://api.whatsapp.com/send?text=<?= get_the_permalink(); ?>`, '_self')">
                  <img src="<?= JC_THEME; ?>/assets/img/icon-x.webp" alt="" onclick="window.open(`https://x.com/intent/post?text=<?= get_the_permalink(); ?>`, '_self')"> -->
					<img src="<?= JC_THEME; ?>/assets/img/icon-fb.webp" alt="Facebook" style="cursor:pointer;"
    onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('<?= get_the_permalink(); ?>'), '_blank', 'width=600,height=400')">

<img src="<?= JC_THEME; ?>/assets/img/icon-wp.webp" alt="WhatsApp" style="cursor:pointer;"
    onclick="window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Mira este artículo: <?= get_the_permalink(); ?>'), '_blank')">

<img src="<?= JC_THEME; ?>/assets/img/icon-x.webp" alt="X" style="cursor:pointer;"
    onclick="window.open('https://x.com/intent/post?text=' + encodeURIComponent('Recomiendo leer: ') + '&url=' + encodeURIComponent('<?= get_the_permalink(); ?>'), '_blank', 'width=600,height=400')">
<!--                   <img src="<?= JC_THEME; ?>/assets/img/icon-link.webp" alt="" onclick="window.open(`https://www.linkedin.com/sharing/share-offsite/?url=<?= get_the_permalink(); ?>`, '_self')"> -->
					<img src="<?= JC_THEME; ?>/assets/img/icon-link.webp" alt="Copiar enlace" 
style="cursor:pointer;"
onclick="navigator.clipboard.writeText('<?= get_the_permalink(); ?>'); alert('¡Enlace copiado al portapapeles!');">
                </div>
              </div>
              <div class="position-relative style-content">
                <?php the_content(); ?>
              </div>
            </div>

            <div class="bloque6Right"></div>
          </div>
        </div>
        <div class="bloque7Right">
          <?php get_template_part( 'templates/content', 'newsletter', array( 'class' => 'bloque2ProgramRight bloque2ProgramRightDesktop' ) ); ?>
        </div>
      </article>

    <?php endwhile;
  endif;
  ?>
</main>

<div class="bloque4"> 
  <div class="bloque4Container">

    <?php get_template_part( 'templates/content', 'call-to-action' ); ?>
	<?php $realted = get_post_meta( $post->ID, JC_PREFIX.'PGBGB_related', true ); ?>
    <div class="bloque2ProgramLeft bloque2IndividualLeft">
      <div class="bloque2Title">
        <h3>También podría interesarte</h3>
      </div>
      <div class="bloque2Slider">
      
        <div class="slider__container5 swiper mySwiper5">
          <div class="slider__grid5 swiper-wrapper">
            <?php 
              $args = array(
                'post_type'   => 'post',
                'post_status' => 'publish',
                'posts_per_page' => 6,
                'post__not_in' => array($post->ID),
              );
			  if( $realted ):
			   $args['post__in'] = $realted;
			  else:
			  	$args['tax_query'] = array(
                  array(
                    'taxonomy' => 'post_tag',
                    'field' => 'term_id',
                    'terms' => $tag_ids,
                    'operator' => 'IN'
                  )
                );
			  endif;
              $query = new WP_Query( $args );
              if ( $query->have_posts()): 
                
                while ( $query->have_posts() ):
                  $query->the_post();
                  ?>
                  <div class="slider__item5 swiper-slide">
                    <div class="sliderItemInfo5">
                      <div class="sliderItemInfo5Image">
                        <?php if ( has_post_thumbnail() ): ?>
                          <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>'bloque4ItemImage','loading' => 'lazy')); ?>
                        <?php endif; ?>
                      </div>
                      <div class="position-relative" style="width:100%;">
                        <div class="sliderItemInfo5Info" >
  
                          <div class="bloque4ItemContentCalendar">
							<!-- prueba -->
                            <img loading="lazy" src="https://blogs.cayetano.edu.pe/wp-content/uploads/2025/11/calendar-icon-whit.png" alt="">
                            <span class="date-card"><?= get_the_date( 'd | Y' ); ?> </span>
                          </div>
						  <?php
							// Obtiene los parámetros UTM de la URL actual
							$utm_params_front = '';
							if (isset($_SERVER['QUERY_STRING']) && !empty($_SERVER['QUERY_STRING'])) {
								$query_string = $_SERVER['QUERY_STRING'];
								// Revisa si hay al menos un parámetro UTM
								if (strpos($query_string, 'utm_') !== false) {
									$utm_params_front = '?' . $query_string;
								}
							}

							// Crea el enlace completo del logo
							$home_url_with_utm_front = get_the_permalink() . $utm_params_front;
						  ?>
                          <a href="<?= $home_url_with_utm_front; ?>" class="text-inherit">
                            <h3><?= get_the_title();  ?></h3>
                          </a>
                          <p><?= get_the_excerpt();  ?></p>
                          
                          <img src="<?= JC_THEME; ?>/assets/img/arrow-black-button.webp" alt="">
                        </div>
                      </div>
                    </div>
                  </div>
                  <?php
                endwhile;
              endif;
              wp_reset_query();
              wp_reset_postdata()
            ?>
          </div>
          <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
        </div>

      </div>
    </div>
  </div>
</div>
<style>
	.style-content{
		font-size: 1.8rem;
		line-height: 1.4;
	}
	.style-content h2{
		color: rgb(255, 12, 41);
	}
	.style-content a{
		font-weight: 700;
		color: #000;
	}
	
</style>


<?php get_template_part( 'templates/content', 'contact' ); ?>

<?php get_footer(); ?>