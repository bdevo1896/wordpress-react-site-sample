<?php
/*
 * ==================================
 * Random Helper Functions
 * ==================================
 */

function my_myme_types($mime_types){
    $mime_types['svg'] = 'image/svg+xml'; //Adding svg extension
	$mime_types['psd'] = 'image/vnd.adobe.photoshop'; //Adding photoshop files
	$mime_types['ai'] = 'image/vnd.adobe.illustrator';
    return $mime_types;
}
add_filter('upload_mimes', 'my_myme_types', 1, 1);

add_filter('xmlrpc_enabled', '__return_false'); //Disables third party featuring of blog for better security

//Automatically links featured images to their posts
function wpb_autolink_featured_images( $html, $post_id, $post_image_id ) {
    
    If (! is_singular()) {
        
        $html = '<a href="' . get_permalink( $post_id ) . '" title="' . esc_attr( get_the_title( $post_id ) ) . '">' . $html . '</a>';
        return $html;
        
    } else {
        
        return $html;
        
    }
    
}
add_filter( 'post_thumbnail_html', 'wpb_autolink_featured_images', 10, 3 );

add_theme_support( 'post-thumbnails' );

/*
	Exposing Advanced Custom Fields in every post,page, and custom post type
*/
function exposeAllACF() {
	
	add_filter('graphql_post_fields', function($fields)
	{
		$fields['acf'] = [
			'type' => \WPGraphQL\Types::string(),
			'resolve' => function($post)
			{
				$fields = get_fields($post->ID);
				return !empty($fields) ? json_encode($fields) : null;
			},
		];
	
		return $fields;
	});
	
	add_filter('graphql_page_fields', function($fields)
	{
		$fields['acf'] = [
			'type' => \WPGraphQL\Types::string(),
			'resolve' => function($post)
			{
				$fields = get_fields($post->ID);
				return !empty($fields) ? json_encode($fields) : null;
			},
		];
	
		return $fields;
	});

	add_filter('graphql_Fruit_fields', function($fields)
	{
		$fields['acf'] = [
			'type' => \WPGraphQL\Types::string(),
			'resolve' => function($post)
			{
				$fields = get_fields($post->ID);
				return !empty($fields) ? json_encode($fields) : null;
			},
		];
	
		return $fields;
	});

}

add_action('init','exposeAllACF');

add_filter( 'register_post_type_args', function( $args, $post_type ) {

	if ( 'fruits' === $post_type ) {
			$args['show_in_graphql'] = true;
			$args['graphql_single_name'] = 'Fruit';
			$args['graphql_plural_name'] = 'Fruits';
	}

	return $args;

}, 10, 2 );

/*
	This function exposes all SEO meta data to the GraphQl server. This only works with the SEO Framework plugin because
	of the specific data values that have to be found and loaded.
	_genesis_title = The title that will show in the search results of the page
	_genesis_description = The description of the page that will show in search results
	robot_rules = The meta data for allowing bots to crawl the page
*/
function exposeSEOMeta() {

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'Page', 'seoTitle', [
		   'type' => 'string',
		   'description' => __( 'The meta title of the post', 'wp-graphql' ),
		   'resolve' => function( $post ) {
			 $meta_title = get_post_meta( $post->ID, '_genesis_title', true );
			 return ! empty( $meta_title ) ? $meta_title : 'No Title Found';
		   }
		] );
	  } );

	  add_action( 'graphql_register_types', function() {
		register_graphql_field( 'Page', 'seoDescription', [
		   'type' => 'String',
		   'description' => __( 'The meta description of the post', 'wp-graphql' ),
		   'resolve' => function( $post ) {
			 $meta_desc = get_post_meta( $post->ID, '_genesis_description', true );
			 return ! empty( $meta_desc ) ? $meta_desc : 'No Description Found';
		   }
		] );
	  } );

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'Post', 'seoTitle', [
		   'type' => 'String',
		   'description' => __( 'The meta title of the post', 'wp-graphql' ),
		   'resolve' => function( $post ) {
			 $meta_title = get_post_meta( $post->ID, '_genesis_title', true );
			 return ! empty( $meta_title ) ? $meta_title : 'No Title Found';
		   }
		] );
	  } );

	  add_action( 'graphql_register_types', function() {
		register_graphql_field( 'Post', 'seoDescription', [
		   'type' => 'String',
		   'description' => __( 'The meta description of the post', 'wp-graphql' ),
		   'resolve' => function( $post ) {
			 $meta_desc = get_post_meta( $post->ID, '_genesis_description', true );
			 return ! empty( $meta_desc ) ? $meta_desc : 'No Description Found';
		   }
		] );
	  } );
		
		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'Fruit', 'seoTitle', [
				 'type' => 'String',
				 'description' => __( 'The meta title of the post', 'wp-graphql' ),
				 'resolve' => function( $post ) {
				 $meta_title = get_post_meta( $post->ID, '_genesis_title', true );
				 return ! empty( $meta_title ) ? $meta_title : 'No Title Found';
				 }
			] );
			} );
	
			add_action( 'graphql_register_types', function() {
			register_graphql_field( 'Fruit', 'seoDescription', [
				 'type' => 'String',
				 'description' => __( 'The meta description of the post', 'wp-graphql' ),
				 'resolve' => function( $post ) {
				 $meta_desc = get_post_meta( $post->ID, '_genesis_description', true );
				 return ! empty( $meta_desc ) ? $meta_desc : 'No Description Found';
				 }
			] );
			} );
}

add_action('init','exposeSEOMeta');

function exposeOtherUsefulPostFields() {
	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'Post', 'dateCreated', [
		   'type' => 'String',
		   'description' => __( 'The last modified date of the post', 'wp-graphql' ),
		   'resolve' => function( $post ) {
			// $meta_keys = get_field('keywords',$post->ID,'false');
			$date = get_the_date();
			 return ! empty( $date ) ? $date : 'No creation date';
		   }
		] );
		} );

	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'Post', 'lastModified', [
		   'type' => 'String',
		   'description' => __( 'The last modified date of the post', 'wp-graphql' ),
		   'resolve' => function( $post ) {
			// $meta_keys = get_field('keywords',$post->ID,'false');
			$date = get_the_modified_date();
			 return ! empty( $date ) ? $date : 'No last modified date';
		   }
		] );
		} );
		
		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'Fruit', 'lastModified', [
				 'type' => 'String',
				 'description' => __( 'The last modified date of the post', 'wp-graphql' ),
				 'resolve' => function( $post ) {
				// $meta_keys = get_field('keywords',$post->ID,'false');
				$date = get_the_modified_date();
				 return ! empty( $date ) ? $date : 'No last modified date';
				 }
			] );
			} );

			add_action( 'graphql_register_types', function() {
				register_graphql_field( 'Fruit', 'dateCreated', [
					 'type' => 'String',
					 'description' => __( 'The last modified date of the post', 'wp-graphql' ),
					 'resolve' => function( $post ) {
					// $meta_keys = get_field('keywords',$post->ID,'false');
					$date = get_the_date();
					 return ! empty( $date ) ? $date : 'No creation date';
					 }
				] );
				} );

				add_action( 'graphql_register_types', function() {
					register_graphql_field( 'Fruit', 'description', [
						 'type' => 'String',
						 'description' => __( 'The Fruit description', 'wp-graphql' ),
						 'resolve' => function( $post ) {
						$description = get_field('description',$post->ID,'false');
						 return ! empty( $description ) ? $description : 'No description yet';
						 }
					] );
					} );
				
					add_action( 'graphql_register_types', function() {
						register_graphql_field( 'Fruit', 'videoCount', [
							 'type' => 'Int',
							 'description' => __( 'Number of videos in the Fruit', 'wp-graphql' ),
							 'resolve' => function( $post ) {
							$videos = get_field('videos',$post->ID,'false');
							 return sizeof($videos);
							 }
						] );
						} );
}

add_action('init','exposeOtherUsefulPostFields');

/*
	This section is for custom items that are global on the site. These can be announcement callouts for example 
*/
function custom_theme_global_content($wp_customize) {

		$wp_customize->add_section('header-scripts-section',array(
			'title' => 'Header Scripts'
		));
	
		$wp_customize->add_setting('header-scripts-settings',array(
			'default' => 'Example Headline Text!',
		));
	
		$wp_customize->add_control(new WP_Customize_Control($wp_customize,
			'header-scripts-control', array(
				'label' => 'Scripts',
				'section' => 'header-scripts-section',
				'settings' => 'header-scripts-settings',
				'type' => 'textarea'
			)));

		$wp_customize->add_section('footer-scripts-section',array(
			'title' => 'Footer Scripts'
		));
	
		$wp_customize->add_setting('footer-scripts-settings',array(
			'default' => 'Example Headline Text!',
		));
	
		$wp_customize->add_control(new WP_Customize_Control($wp_customize,
			'footer-scripts-control', array(
				'label' => 'Scripts',
				'section' => 'footer-scripts-section',
				'settings' => 'footer-scripts-settings',
				'type' => 'textarea'
			)));
		
}

add_action('customize_register','custom_theme_global_content');

function exposeThemeSettings() {
	add_action( 'graphql_register_types', function() {
		register_graphql_field( 'GeneralSettings', 'footerScripts', [
			 'type' => 'String',
			 'description' => __( 'Third party scripts to be put in the footer', 'wp-graphql' ),
			 'resolve' => function( ) {
			 return get_theme_mod('footer-scripts-settings');
			 }
		] );
		} );

		add_action( 'graphql_register_types', function() {
			register_graphql_field( 'GeneralSettings', 'headerScripts', [
				 'type' => 'String',
				 'description' => __( 'Third party scripts to be put in the header', 'wp-graphql' ),
				 'resolve' => function( ) {
				 return get_theme_mod('header-scripts-settings');
				 }
			] );
			} );
}

add_action('init','exposeThemeSettings');
?>