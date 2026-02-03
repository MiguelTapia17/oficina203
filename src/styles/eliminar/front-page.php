<?php
/**
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package WordPress
 * @since malcolm 2.5.1
 */
global $post;

get_header();

  ?>
  <div class="bloque2">
    <div class="bloque2Container">
      <?php if ( get_post_meta( $post->ID, JC_PREFIX.'PHND_title', true ) ): ?>
        <div class="bloque2Title">
          <h3><?= get_post_meta( $post->ID, JC_PREFIX.'PHND_title', true );  ?> </h3>
        </div>
      <?php endif; ?>
      <?php $list = get_post_meta( $post->ID, JC_PREFIX.'PHND_list', true ); ?>
      <?php if( $list ): ?>
        <div class="bloque2Slider">

          <div class="slider__container3 swiper mySwiper3">
            <div class="slider__grid3 swiper-wrapper" >
              <?php 
                $args = array(
                  'post_type'   => 'post',
                  'post_status' => 'publish',
                  'posts_per_page' => -1,
                );
                if( $list ):
                  $args['post__in'] = $list;
                endif;
                $query = new WP_Query( $args );
                $index = 0 ;
                if ( $query->have_posts()): 
                  
                  while ( $query->have_posts() ):
                    $query->the_post();
                    ?>
                    <div class="slider__item3 swiper-slide">
                      <div class="sliderItemInfo3 swiper-slide1">
                        <?php if ( has_post_thumbnail() ): ?>
                          <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>'sliderItemInfo3Image','loading' => 'lazy')); ?>
                        <?php endif; ?>
                        <div class="sliderItemInfo3Calendar">
                          <img loading="lazy" src="<?= JC_THEME; ?>/assets/img/calendar-icon-whit.webp" alt="">
                          <span class="date-card"><?= get_the_date( 'd | m | Y' ); ?> </span>
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
					    <!-- <a href="<?= get_the_permalink(); ?>" class="sliderItemInfo3Info" > -->
                        <a href="<?= $home_url_with_utm_front; ?>" class="sliderItemInfo3Info" >
						  <!-- ESCUCHA -->
                          <img class="keyframe-button-movement" loading="lazy" src="https://blogs.cayetano.edu.pe/wp-content/uploads/2026/02/arrowRight.png" alt="">
                          <h3><?= get_the_title(); ?></h3>
                        </a>
                      </div>
                    </div>
                    <?php
                    $index ++;
                  endwhile;
                endif;
                wp_reset_query();
                wp_reset_postdata()
              ?>
            </div>
            <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
          </div>

          <div class="bloque2Banner bloque2BannerDesktop">
            <h3>Síguenos en nuestras <br>redes sociales</h3>
            <div class="bloque2RedesSociales">
              <?php if ( get_post_meta( $post->ID, JC_PREFIX.'PHND_wp', true ) ): ?>
                <a href="<?= get_post_meta( $post->ID, JC_PREFIX.'PHND_wp', true ); ?>" target="_blank" rel="noopener noreferrer">
                  <img loading="lazy" src="<?= JC_THEME; ?>/assets/img/icon-wp.webp" alt="" />
                </a>
              <?php endif; ?>
              <?php if ( get_post_meta( $post->ID, JC_PREFIX.'PHND_fb', true ) ): ?>
                <a href="<?= get_post_meta( $post->ID, JC_PREFIX.'PHND_fb', true ) ; ?>" target="_blank" rel="noopener noreferrer">
                  <img loading="lazy" src="<?= JC_THEME; ?>/assets/img/icon-fb.webp" alt="" />
                </a>
              <?php endif; ?>
            </div>
            <?php if ( get_post_meta( $post->ID, JC_PREFIX.'PHND_gif', true ) ): ?>
              <?php $file_id = get_post_meta( $post->ID, JC_PREFIX.'PHND_gif_id', true ); ?>
              <?= wp_get_attachment_image( $file_id, 'full' , '' , array('class'=>'bloque2BannerDesktopImage','loading' => 'lazy')); ?>
            <?php endif; ?>
            <div class="bloque2BannerContent">
              <div class="bloque2BannerContentItem"></div>
              <div class="bloque2BannerContentItem"></div>
              <div class="bloque2BannerContentItem"></div>
            </div>
          </div>
        </div>
      <?php endif; ?>
    </div>
  </div>

  <div class="bloque3">
    <div class="bloque3Container">
      <div class="bloque3Title">
        <h3>Notas recientes </h3>
      </div>
	  
      <?php 
        $args = array(
          'post_type'      => 'post',
          'post_status'    => 'publish',
		  'order' 		   => 'DESC', //antes ASC
          'posts_per_page' => 5,
		  'orderby' => 'date', // ELIMINAR
        );
		
        $notes = new WP_Query( $args );
      ?>
      <?php if ( $notes->have_posts() && wp_is_mobile()):  ?>
        <div class="bloque3Slider">
			<!-- prueba Slider3 -->
          <div class="slider__container4 swiper mySwiper4">
            <div class="slider__grid4 swiper-wrapper">
              <?php $counter = 0; ?>
              <?php while ( $query->have_posts() ): ?>
                <?php $query->the_post(); ?>
                <?php 
                if ( $counter % 3 == 0 ):
                  echo '<div class="slider__item4 swiper-slide"><div class="sliderItemInfo4">';
                endif;
                ?>
                  <div class="sliderItemInfo4Item">
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
                    <a href="<?= $home_url_with_utm_front; ?>" class="sliderItemInfo4ItemInfo">
                      <div class="sliderItemInfo4ItemInfoCalendar">
                        <img loading="lazy" src="<?= JC_THEME; ?>/assets/img/calendar-icon-whit.webp" alt="">
                        <span class="date-card"><?= get_the_date( 'd | m | Y' ); ?> </span>
                      </div>
                      <h3><?= get_the_title(); ?></h3>
                      <img class="keyframe-button-movement" loading="lazy" src="<?= JC_THEME; ?>/assets/img/arrow-black-button.webp" alt="">
                    </a>
                    <div class="sliderItemInfo4ItemImage">
                      <?php if ( has_post_thumbnail() ): ?>
                        <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>' w-auto','loading' => 'lazy')); ?>
                      <?php endif; ?>
                    </div>
                  </div>
                <?php
                  $counter++;
                  if ( $counter % 3 == 0 ):
                    echo '</div></div>';
                  endif;
                ?>
              <?php endwhile;  ?>

              <?php if ( $counter % 3 != 0 ): ?>
                <?= '</div></div>';  ?>
              <?php endif;  ?>

            </div>
            <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
          </div>
          <div class="swiper-pagination4"></div>
          <div class="swiper-button-prev4"> 
            <img loading="lazy" src="<?= JC_THEME; ?>/assets/img/arrow-black-left.webp" alt="">
          </div>
          <div class="swiper-button-next4">
            <img loading="lazy" src="<?= JC_THEME; ?>/assets/img/arrow-black-right.webp" alt="">
          </div>
        </div>
      <?php endif; ?>
      <?php wp_reset_query(); wp_reset_postdata() ?>

      <?php if ( $notes->have_posts() && !wp_is_mobile()):  ?>
        <div class="bloque3SliderDesktop">
          <div class="slider__container6 swiper mySwiper6">
            <div class="slider__grid6 swiper-wrapper">
              <?php while ( $notes->have_posts() ): ?>
                <?php $notes->the_post(); ?>
                <div class="slider__item6 swiper-slide ">
                  <div class="sliderItemInfo6">
                    <div class="sliderItemInfo6Item">
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
                      <a class="sliderItemInfo6ItemInfo" href="<?= $home_url_with_utm_front; ?>">
						  <!--ARCHIVE-->
                        <div class="sliderItemInfo6ItemInfoCalendar">
                          <img loading="lazy" src="<?= JC_THEME; ?>/assets/img/calendar-icon-whit.webp" alt="">
                          <span class="date-card"><?= get_the_date( 'd | m | Y' ); ?> </span>
                        </div>
                        <h3><?= get_the_title(); ?></h3>
                        <img class="keyframe-button-movement" loading="lazy" src="<?= JC_THEME; ?>/assets/img/arrow-black-button.webp" alt="">
                      </a>
                      <?php if ( has_post_thumbnail() ): ?>
                        <div class="sliderItemInfo6ItemImage">
                          <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>' w-auto','loading' => 'lazy')); ?>
                        </div>
                      <?php endif; ?>
                    </div>
                  </div>
                </div>
              <?php endwhile;  ?>
            </div>
            <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
          </div>
          <div class="swiper-pagination6"> </div>
        </div>
      <?php endif; ?>
      <?php wp_reset_query(); wp_reset_postdata() ?>
    </div>
  </div>

  <div class="bloque4"> 
    <div class="bloque4Container">
      <?php get_template_part( 'templates/content', 'call-to-action' ); ?>
      
      <div class="bloque4ContentItems">
        <?php 
          $args = array(
            'post_type'   => 'post',
            'post_status' => 'publish',
            'posts_per_page' => 6,
			'order'      => 'DESC', //MIGUEL
			'orderby'    => 'date', //MIGUEL
     		'offset'     => 5 // salta los primeros 5
          );
		  
          $query = new WP_Query( $args );
          if ( $query->have_posts()): 
            
            while ( $query->have_posts() ):
              $query->the_post();
              ?>
              <div class="bloque4Item linebottom">
                <?php if ( has_post_thumbnail() ): ?>
                  <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>'bloque4ItemImage','loading' => 'lazy')); ?>
                <?php endif; ?>
                <div class="bloque4ItemContent">
					<!--se fue-->
                  <div class="bloque4ItemContentCalendar">
                    <img loading="lazy" src="<?= JC_THEME; ?>/assets/img/calendar-icon-whit.webp" alt="">
                    <span class="date-card"><?= get_the_date( 'd | m | Y' ); ?> </span>
                  </div>
                  <div class="bloque4ItemContentText">
					 <?php
					  // Obtiene los parámetros UTM de la URL actual
					  $utm_params_front_bt = '';
					  if (isset($_SERVER['QUERY_STRING']) && !empty($_SERVER['QUERY_STRING'])) {
						  $query_string = $_SERVER['QUERY_STRING'];
						  // Revisa si hay al menos un parámetro UTM
						  if (strpos($query_string, 'utm_') !== false) {
							  $utm_params_front_bt = '?' . $query_string;
						  }
					  }

					  // Crea el enlace completo del logo
					  $home_url_with_utm_front_bt = get_the_permalink() . $utm_params_front_bt;
					?>
					  <!--AQUI-->
                    <a href="<?= $home_url_with_utm_front_bt; ?>" class="text-inherit">
                      <h3><?= get_the_title();  ?></h3>
                    </a>
                  </div>
                  <div class="bloque4ItemContentParagraph">
                    <h3><?= get_the_excerpt();  ?></h3>
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
	 <?php $blog_id = get_option( 'page_for_posts' ); ?>
	<?php if( $blog_id ): ?>
	  <div style="text-align:center;padding:20px 0px;">
		   <!--AQUI-->
		<a class="btn-link" href="<?= get_the_permalink($blog_id);?>" style="margin: auto;">
        	<span>Ver todos</span>
        	<img class="keyframe-button-movement" loading="lazy" src="https://blogs.cayetano.edu.pe/wp-content/themes/cayetano/assets/img/arrow-black-button.webp" alt="">
        </a>
	  </div>
	<?php endif;?>
    </div>
  </div>

  <?php get_template_part( 'templates/content', 'contact' ); ?>

  <?php
  //get_template_part( TPAGES, 'home' );
get_footer();
