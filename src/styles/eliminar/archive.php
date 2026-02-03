<?php get_header(); ?>
  <?php 
    $obj = get_queried_object(); 
    $tsg = get_query_var('tag');
    $tags = get_terms(array(
      'taxonomy'   => 'post_tag',
      'hide_empty' => false,
      'exclude'    => array( 1 ),
    ));
  ?>

  <div class="bloque1">
    <div class="bloque1Container">
      <?php get_template_part( 'templates/content', 'bloque-1' ); ?>
      <?php get_template_part( 'templates/content', 'bloque-2' ); ?>

      <div class="bloque1Title">
        <h3>Blog <?php single_cat_title(); ?></h3>
        <p><?= category_description(); ?></p>
      </div>
      <?php $last_ids = get_postby(3, get_queried_object_id(), $obj->taxonomy );  ?>
      <div class="bloque1Slider bloque1SliderPregrado">
        <div class="slider__container2 swiper mySwiper2">
          <div class="slider__grid2 swiper-wrapper">
            <?php 
              $args = array(
                'post_type'   => 'post',
                'post_status' => 'publish',
                'post__in'    => $last_ids
              );

              $query = new WP_Query( $args );
              if ( $query->have_posts()): 
                
                while ( $query->have_posts() ):
                  $query->the_post();
                  ?>
                  <div class="slider__item2 swiper-slide">
                    <div class="sliderItemInfo2 swiper-slide1">
                      <?php if ( has_post_thumbnail() ): ?>
                        <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>'sliderItemInfo2Image','loading' => 'lazy')); ?>
                      <?php endif; ?>
                      <h3 class="sliderItemInfo2Title"><?= get_the_title(); ?> </h3>
                      <div class="sliderItemCalendar">
                        <img src="<?= JC_THEME; ?>/assets/img/calendar-icon-whit.webp" alt="">
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
                      <a href="<?= $home_url_with_utm_front; ?>" class="btn">
                        <span>Lee más</span>
                        <img class="keyframe-button-movement" src="<?= JC_THEME; ?>/assets/img/arrow-black-button.webp" alt="">
                      </a>
                    </div>
                  </div>
                  <?php
                endwhile;
              endif;
              wp_reset_query();
              wp_reset_postdata()
            ?>
          </div>
        <span class="swiper-notification"></span></div>
        <div class="swiper-pagination2"></div>
        <div class="swiper-button-prev2"> <img src="<?= JC_THEME; ?>/assets/img/arrow-black-left.webp" alt=""></div>
        <div class="swiper-button-next2"><img src="<?= JC_THEME; ?>/assets/img/arrow-black-right.webp" alt=""></div>
      </div>

      <div class="bloque1PregradoContent">
        <?php if(isset($last_ids[0])): ?>
          <div class="bloque1PregradoContentLeft">
            <?php if ( has_post_thumbnail( $last_ids[0] ) ): ?>
              <?=  wp_get_attachment_image( get_post_thumbnail_id($last_ids[0]), 'full' , '' , array('class'=>'bloque1PregradoContentLeftBack','loading' => 'lazy')); ?>
            <?php endif; ?>
            <div class="bloque1PregradoContentLeftDesktop">
              <div class="sliderItemCalendarPregrado">
                <img src="<?= JC_THEME; ?>/assets/img/calendar-icon-whit.webp" alt="">
                <span class="date-card"><?= get_the_date( 'd | m | Y', $last_ids[0] ); ?> </span>
              </div>
              <div class="bloque1PregradoContentLeftDesktopTitle">
                <h3><?= get_the_title($last_ids[0]); ?></h3>
              </div>
              <div class="bloque1PregradoContentLeftDesktopButton">
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

					// Genera la URL del botón con los UTMs
					$btn_url = get_the_permalink($last_ids[0]) . $utm_params;
				?>

				  <a href="<?= esc_url($btn_url); ?>" class="btn">
					  <span class="keyframe-button-movementBlack">Lee más</span>
					  <img class="keyframe-button-movement keyframe-button-movementBlack" src="<?= JC_THEME; ?>/assets/img/arrow-black-button.webp" alt="">
				  </a>
<!--                 <a href="<?= get_the_permalink($last_ids[0])?>" class="btn">
                  <span class="keyframe-button-movementBlack" >Lee más</span>
                  <img class="keyframe-button-movement keyframe-button-movementBlack" src="<?= JC_THEME; ?>/assets/img/arrow-black-button.webp" alt="">
                </a> -->
              </div>
            </div>
          </div>
        <?php endif; ?>
        <div class="bloque1PregradoContentRight">
          <?php if(isset($last_ids[1])): ?>
            <div class="bloque1PregradoContentRightTop">
              <?php if ( has_post_thumbnail( $last_ids[1] ) ): ?>
                <?=  wp_get_attachment_image( get_post_thumbnail_id($last_ids[1]), 'full' , '' , array('class'=>'bloque1PregradoContentLeftBack','loading' => 'lazy')); ?>
              <?php endif; ?>
              <div class="bloque1PregradoContentLeftDesktop bloque1PregradoContentRightDesktop">
                <div class="sliderItemCalendarPregrado">
                  <img src="<?= JC_THEME; ?>/assets/img/calendar-icon-whit.webp" alt="">
                  <span class="date-card"><?= get_the_date( 'd | m | Y', $last_ids[1] ); ?> </span>
                </div>
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

					// Genera la URL del título con los UTMs
					$title_url = get_the_permalink($last_ids[1]) . $utm_params;
				  ?>

					<div class="bloque1PregradoContentLeftDesktopTitle">
						<a href="<?= esc_url($title_url); ?>" class="text-inherit"> 
							<h3><?= get_the_title($last_ids[1]) ?></h3>
						</a>
					</div>
<!--                 <div class="bloque1PregradoContentLeftDesktopTitle">
                  <a href="<?= get_the_permalink($last_ids[1])?>" class="text-inherit"> <h3><?= get_the_title($last_ids[1]) ?></h3></a>
                </div> -->
              </div>
            </div>
          <?php endif; ?>
          <?php if(isset($last_ids[2])): ?>
            <div class="bloque1PregradoContentRightBottom">
              <?php if ( has_post_thumbnail( $last_ids[2] ) ): ?>
                <?=  wp_get_attachment_image( get_post_thumbnail_id($last_ids[2]), 'full' , '' , array('class'=>'bloque1PregradoContentLeftBack','loading' => 'lazy')); ?>
              <?php endif; ?>
              <div class="bloque1PregradoContentLeftDesktop bloque1PregradoContentRightDesktop">
                <div class="sliderItemCalendarPregrado">
                  <img src="<?= JC_THEME; ?>/assets/img/calendar-icon-whit.webp" alt="">
                  <span class="date-card"><?= get_the_date( 'd | m | Y', $last_ids[2] ); ?> </span>
                </div>
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

					// Genera la URL del título con los UTMs
					$title_url2 = get_the_permalink($last_ids[2]) . $utm_params;
				  ?>
                <div class="bloque1PregradoContentLeftDesktopTitle">
                  <a href="<?= esc_url($title_url2); ?>" class="text-inherit"> <h3><?= get_the_title($last_ids[2]) ?></h3></a>
                </div>
              </div>
            </div>
          <?php endif; ?>
        </div>
      </div>
      <div class="bloque1SelectProgramGrid">
        <?php if( $tags ): ?>
          <select class="bloque2SelectProgramMobile" id="filterMobile">
            <option value="todos">Todos</option>
            <?php  foreach ( $tags as $tag ):?>
              <option value="<?= $tag->slug; ?>"><?= esc_html( $tag->name ); ?></option>
            <?php endforeach;?>
          </select>
        <?php endif; ?>
      </div>
    </div>
  </div>

  <div class="bloque7">
    <div class="bloque7Container">
      <div class="bloque7Left">
        <div class="bloque2">
          <div class="bloque2Container bloque2ContainerProgram">
            <div class="bloque2ProgramLeft">
              <div class="bloque2Title">
                <h3>Notas publicadas</h3>
              </div>
              <div class="bloque2DesktopCards news-list">
                <?php 
                  $paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;

					// Detectar si viene un tag por la URL (para el filtro AJAX)
					$tag_filter = isset($_GET['tag']) ? sanitize_text_field($_GET['tag']) : $tsg;

					$args = array(
						'post_type'           => 'post',
						'post_status'         => 'publish',
						'post__not_in'        => $last_ids, 
						'paged'               => $paged,
						'orderby'             => 'date',
						'order'               => 'DESC',
						'ignore_sticky_posts' => true,
						'tax_query'           => array(
							'relation' => 'AND',
							array(
								'taxonomy' => $obj->taxonomy,
								'field'    => 'id',
								'terms'    => get_queried_object_id()
							)
						)
					);

					// Si hay un tag seleccionado, lo añadimos a la consulta para que recalcule el total
					if ( $tag_filter ) {
						$args['tax_query'][] = array(
							'taxonomy' => 'post_tag',
							'field'    => 'slug',
							'terms'    => $tag_filter
						);
					}

					$query = new WP_Query( $args );
                  if ( $query->have_posts()): 
                    $index = 0;
                    while ( $query->have_posts() ):
                      $query->the_post();
                      if( $index < 6):
                      ?>
                      <div class="card">
                        <div class="bloque2DesktopCardsItem">
                          <?php if ( has_post_thumbnail() ): ?>
                            <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>'','loading' => 'lazy')); ?>
                          <?php endif; ?>
                          <div class="content">
                            <div class="sliderItemInfo6ItemInfoCalendar">
                              <img src="https://blogs.cayetano.edu.pe/wp-content/uploads/2025/11/calendar-icon-whit.png" alt="">
                              <span class="date-card text-black"><?= get_the_date( 'd | m | Y' ); ?> </span>
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
                            <a href="<?= $home_url_with_utm_front; ?>" class="text-inherit card-column">
                              <h3><?= get_the_title(); ?></h3>
                              <p><?= get_the_excerpt(); ?></p>
                              <img class="keyframe-button-movement" src="<?= JC_THEME; ?>/assets/img/arrow-black-button.webp" alt="">
                            </a>
                          </div>
                        </div>
                      </div>
                      <?php
                      else:
                        ?>
                        <div class="bloque4Item linebottom">
                          <?php if ( has_post_thumbnail() ): ?>
                            <?=  wp_get_attachment_image( get_post_thumbnail_id(), 'full' , '' , array('class'=>'bloque4ItemImage','loading' => 'lazy')); ?>
                          <?php endif; ?>
                          <div class="bloque4ItemContent bloque4ItemContentPregrado">
                            <div class="bloque4ItemContentCalendar">
                              <img src="<?= JC_THEME; ?>/assets/img/calendar-icon-whit.webp" alt="">
                              <span class="date-card text-red"><?= get_the_date( 'd | m | Y' ); ?> </span>
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
                            <a href="<?= $home_url_with_utm_front; ?>" class="bloque4ItemContentText">
                              <h3><?= get_the_title(); ?></h3>
                              <div class="bloque4ItemContentParagraph">
                                <h3><?= get_the_excerpt(); ?></h3>
                              </div>
                            </a>
                          </div>
                        </div>
                        <?php
                      endif;
                      $index++;
                    endwhile;
                  endif;
                  wp_reset_query();
                  wp_reset_postdata()
                ?>
              </div>
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
			<?php if(wp_is_mobile()): ?>
            <div class="bloque2ProgramRight">
              <div class="bloque2ProgramRightContainer">
                <div class="bloque2ProgramRightContainerCategories"></div>
                <?php get_template_part( 'templates/content', 'newsletter', array( 'mobile' => true ) ); ?>
              </div>
            </div>
			 <?php endif; ?> 
          </div>
        </div>

        <div class="bloque4 bloque4Pregrado"> 
          <div class="bloque4Container">

            <div class="bloque4Banner bloque4Banner2">
              <div class="banner2Image">
 				  <!--<img src="https://blogs.cayetano.edu.pe/img/banner-image1.webp" alt=""> -->
				</div>
              <div class="banner2Container">
                <div class="bloque4BannerLeft">
                  <h3>¿Buscas una educación de calidad?</h3>
                  <h4>Estudia en la <span>universidad <br> N.° 1 del Perú</span></h4>
                </div>
                <button onclick="window.open('https://lp.cayetano.edu.pe/admision-cayetano/?utm_campaign=pregrado-aon&amp;utm_term=brand&amp;utm_source=blog&amp;utm_medium=organic&amp;utm_content=banner-1-n21', '_self')">
                  <h5>Postula aquí</h5><img class="keyframe-button-movement" src="https://blogs.cayetano.edu.pe/wp-content/themes/cayetano/assets/img/arrow-black-button.webp" alt="">
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="bloque7Right">
        <div class="bloque2ProgramRight bloque2ProgramRightDesktop">
          <div class="bloque2ProgramRightContainer">
            <?php if( $tags ): ?>
              <select class="bloque2SelectProgram" id="filter-list">
                <option value="todos">Todos</option>
                <?php  foreach ( $tags as $tag ):?>
                  <option value="<?= $tag->slug; ?>"><?= esc_html( $tag->name ); ?></option>
                <?php endforeach;?>
              </select>
		  <script>
document.addEventListener('DOMContentLoaded', function () {

  function trackSelect(selectEl) {
    if (!selectEl) return;

    selectEl.addEventListener('change', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'select_carrera_blog',
        carrera: this.value
      });
    });
  }

  // Desktop
  trackSelect(document.getElementById('filter-list'));

  // Mobile
  trackSelect(document.getElementById('filterMobile'));

});
</script>  
            <?php endif; ?>
			  <?php if(!wp_is_mobile()): ?>
            <?php get_template_part( 'templates/content', 'newsletter', array( 'mobile' => false ) ); ?>
			  <?php endif; ?>
          </div>
        </div>
      </div>

    </div>
  </div>

  
  <?php get_template_part( 'templates/content', 'contact' ); ?>

<!-- <script>
document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = '<?= esc_js( get_term_link( get_queried_object() ) ); ?>';
    
    function handleFilterChange(e) {
        const val = e.target.value;
        const url = (val !== 'todos') ? `${baseUrl}tag/${val}` : `${baseUrl}`;
        
        console.log("Cargando URL: " + url); // Debug
        window.history.pushState({ path: url }, '', url);

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Error en la red');
                return response.text();
            })
            .then(htmlString => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                
                // SELECTORES: Asegúrate de que coincidan con las clases de tu PHP
                const newNewsList = doc.querySelector('.news-list');
                const newPagination = doc.querySelector('.pagination');
                
                const currentNewsList = document.querySelector('.news-list');
                const currentPagination = document.querySelector('.pagination');

                if (newNewsList && currentNewsList) {
                    console.log("Contenido encontrado, reemplazando...");
                    currentNewsList.innerHTML = newNewsList.innerHTML;
                    
                    // Forzar el scroll para que el usuario note el cambio
                    window.scrollTo({
                        top: currentNewsList.offsetTop - 100,
                        behavior: 'smooth'
                    });
                } else {
                    console.error("No se encontró .news-list en la respuesta o en el DOM actual");
                }
                
                if (currentPagination) {
                    currentPagination.innerHTML = newPagination ? newPagination.innerHTML : '';
                }
            })
            .catch(error => console.error('Error en fetch:', error));
    }

    const selectDesktop = document.querySelector('#filter-list');
    const selectMobile = document.querySelector('#filterMobile');

    if (selectDesktop) selectDesktop.addEventListener('change', handleFilterChange);
    if (selectMobile) selectMobile.addEventListener('change', handleFilterChange);
});
</script> -->
<!-- <script>
document.addEventListener('DOMContentLoaded', function () {
    // Obtenemos la base real del sitio para evitar el prefijo /pregrado/ en el fetch
    const siteUrl = window.location.origin; 
    
    function handleFilterChange(e) {
        const val = e.target.value;
        
        // CONSTRUCCIÓN DE URL CORREGIDA:
        // Forzamos a que apunte a /tag/ independientemente de dónde estemos
        const url = (val !== 'todos') 
            ? `${siteUrl}/tag/${val}` 
            : window.location.href.split('?')[0].split('/tag/')[0]; // Volver a la base sin etiquetas
        
        console.log("Intentando fetch a URL real: " + url);

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Página no encontrada (404)');
                return response.text();
            })
            .then(htmlString => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                
                const newNewsList = doc.querySelector('.news-list');
                const newPagination = doc.querySelector('.pagination');
                
                const currentNewsList = document.querySelector('.news-list');
                const currentPagination = document.querySelector('.pagination');

                if (newNewsList && currentNewsList) {
                    currentNewsList.innerHTML = newNewsList.innerHTML;
                    // Actualizamos la URL visualmente para el usuario
                    window.history.pushState({ path: url }, '', url);
                } else {
                    console.warn("La etiqueta no tiene posts o la estructura es distinta.");
                    currentNewsList.innerHTML = '<p>No se encontraron notas en esta categoría.</p>';
                }
                
                if (currentPagination) {
                    currentPagination.innerHTML = newPagination ? newPagination.innerHTML : '';
                }
            })
            .catch(error => {
                console.error('Error en el filtrado:', error);
            });
    }

    const selectDesktop = document.querySelector('#filter-list');
    const selectMobile = document.querySelector('#filterMobile');

    if (selectDesktop) selectDesktop.addEventListener('change', handleFilterChange);
    if (selectMobile) selectMobile.addEventListener('change', handleFilterChange);
});
</script> -->
<!-- <script>
document.addEventListener('DOMContentLoaded', function () {
    // La URL base siempre será la de la página actual (ej: .../pregrado/)
    const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    
    function handleFilterChange(e) {
        const val = e.target.value;
        
        // En lugar de rutas /tag/, usamos parámetros ?tag= para evitar el 404
        // WordPress reconoce automáticamente el parámetro 'tag' si se envía correctamente
        const url = (val !== 'todos') ? `${baseUrl}?tag=${val}` : baseUrl;
        
        console.log("Solicitando con parámetro: " + url);

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar resultados');
                return response.text();
            })
            .then(htmlString => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                
                // Extraemos el contenido nuevo
                const newNewsList = doc.querySelector('.news-list');
                const newPagination = doc.querySelector('.pagination');
                
                const currentNewsList = document.querySelector('.news-list');
                const currentPagination = document.querySelector('.pagination');

                if (newNewsList && currentNewsList) {
                    currentNewsList.innerHTML = newNewsList.innerHTML;
                    window.history.pushState({ path: url }, '', url);
                    
                    // Scroll suave al listado
                    currentNewsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.warn("No se encontró contenido para este filtro.");
                    currentNewsList.innerHTML = '<p class="no-results">No se encontraron notas relacionadas.</p>';
                    if(currentPagination) currentPagination.innerHTML = '';
                }
            })
            .catch(error => console.error('Error AJAX:', error));
    }

    const selectDesktop = document.querySelector('#filter-list');
    const selectMobile = document.querySelector('#filterMobile');

    if (selectDesktop) selectDesktop.addEventListener('change', handleFilterChange);
    if (selectMobile) selectMobile.addEventListener('change', handleFilterChange);
});
</script> -->
<script>
document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    
    function handleFilterChange(e) {
        const val = e.target.value;
        const url = (val !== 'todos') ? `${baseUrl}?tag=${val}` : baseUrl;
        
        console.log("Solicitando con parámetro: " + url);

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar resultados');
                return response.text();
            })
            .then(htmlString => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                
                const newNewsList = doc.querySelector('.news-list');
                const newPagination = doc.querySelector('.pagination');
                
                const currentNewsList = document.querySelector('.news-list');
                const currentPagination = document.querySelector('.pagination');

                // 1. Actualizar lista de noticias
                if (newNewsList && currentNewsList) {
                    currentNewsList.innerHTML = newNewsList.innerHTML;
                    window.history.pushState({ path: url }, '', url);
                    currentNewsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    currentNewsList.innerHTML = '<p class="no-results">No se encontraron notas relacionadas.</p>';
                }

                // 2. Lógica de Paginación Acoplada
                if (currentPagination) {
                    if (newPagination && newPagination.innerHTML.trim() !== "") {
                        // Si el nuevo HTML trae paginación (caso "Todos"), la inyectamos y mostramos
                        currentPagination.innerHTML = newPagination.innerHTML;
                        currentPagination.style.display = 'flex'; 
                    } else {
                        // Si no viene paginación (caso "Nutrición"), limpiamos y ocultamos
                        currentPagination.innerHTML = '';
                        currentPagination.style.display = 'none';
                    }
                }
            })
            .catch(error => console.error('Error AJAX:', error));
    }

    const selectDesktop = document.querySelector('#filter-list');
    const selectMobile = document.querySelector('#filterMobile');

    if (selectDesktop) selectDesktop.addEventListener('change', handleFilterChange);
    if (selectMobile) selectMobile.addEventListener('change', handleFilterChange);
});
</script>
<?php get_footer(); ?>
