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
  get_template_part( 'templates/header', 'single' ); 
  ?>
  <div class="position-relative page-new">
    <div class="container">
      <div class="row">
        <div class="w-100 pt-4"></div>
        <div class="content">
          <div class="list-news">
            <?php
            $paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
            $args = array(
              'post_type'    => 'post',
              'post_status'  => 'publish',
              'paged'       => $paged,
			  'orderby'       => 'date',
			  'order'         => 'DESC',
            );
            $query = new WP_Query( $args );
            if ( $query->have_posts()): 
              while ( $query->have_posts() ):
                $query->the_post();
                ?>
			  
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
                <a href="<?= $home_url_with_utm_front; ?>" class="item-article">
                  <article class="wrap">
                    <figure>
                      <?php if ( has_post_thumbnail() ): ?>
                        <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>'bloque4ItemImage','loading' => 'lazy')); ?>
                      <?php endif; ?>
                    </figure>
                    <div class="description">
                      <div class="position-relative tags">
                        <div class="position-relative dates">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar4-week" viewBox="0 0 16 16">
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                            <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                          </svg>
                          <span class="date-card text-red"><?= get_the_date( 'd | m | Y' ); ?> </span>
                        </div>
                        <div class="position-relative tagss">
                          <?php 
                            $tags = wp_get_post_tags(get_the_ID());
                            $tag_ids = array();
                          ?>
                          <?php if( $tags ): ?>
                            <?php  foreach ($tags as $tag): ?>
                              <?php 
                                $tag_ids[] = $tag->term_id;  
                                $color = get_term_meta($tag->term_id, JC_PREFIX.'TAXC_bg', true );
                              ?>
                              <span style="background-color:<?= $color ? $color: '#ff0c29'; ?>"><?= $tag->name; ?></span>
                            <?php endforeach; ?>
                          <?php endif; ?>
                        </div>
                      </div>
                      <h2><?= get_the_title(); ?></h2>
                      <p><?= get_the_excerpt(); ?></p>
                    </div>
                  </article>
                </a>
                <?php
              endwhile;
            endif;
            wp_reset_query();
            wp_reset_postdata()
            ?>
            <?php if ( $query->max_num_pages > 1 ): ?>
              <div class="position-relative pagination">
                <?php
                  $big = 999999999;
                  echo paginate_links( array(
                    'base'      => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
                    'format'    => '?paged=%#%',
                    'current'   => max( 1, get_query_var('paged') ),
                    'total'     => $query->max_num_pages,
                    'prev_next' => false,
                    'prev_text' => '',
                    'next_text' => ''
                  ) );
                ?>
              </div>
            <?php endif; ?>
          </div>
        </div>
        <aside>
          <div class="position-relative list_tags">
            <?php
              $post_tags = get_terms( array(
                  'taxonomy'   => 'post_tag',
                  'hide_empty' => false,
              ) );

              if ( ! empty( $post_tags ) && ! is_wp_error( $post_tags ) ) {
                  echo '<ul>';
                  foreach ( $post_tags as $tag ) {
                      echo '<li><a href="' . esc_url( get_tag_link( $tag ) ) . '">' . esc_html( $tag->name ) . '</a></li>';
                  }
                  echo '</ul>';
              }
              ?>

          </div>
          <?php get_template_part( 'templates/content', 'newsletter', array( 'mobile' => false ) ); ?>
        </aside>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="banner w-full">
          <div class="content">
            <div class="position-relative">
              <h3>Postula a Cayetano con Beca 18</h3>
              <h5>Valoramos tu excelencia académica</h5>
            </div>
            <div class="position-relative">
              <a href="https://lp.cayetano.edu.pe/admision-cayetano/?utm_campaign=pregrado-aon&amp;utm_term=brand&amp;utm_source=blog&amp;utm_medium=organic&amp;utm_content=banner-1-n21" class="btn">
                <span>Postula aquí</span>
                <img class="keyframe-button-movement" loading="lazy" src="<?= JC_THEME; ?>/assets/img/arrow-black-button.webp" alt="">
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <?php get_template_part( 'templates/content', 'contact' ); ?>
  <?php
get_footer();
