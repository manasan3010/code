<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost:2811');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'k11sx[t>~h]CH&X$Wpnk[dFcIn_TtD.*S,}hLY%]a P*)Y7%@}X!wOO;?weM~}iZ');
define('SECURE_AUTH_KEY',  '`PbQkV)^{,=`Rx{5_O2YgJ6*g$tZIt2p,t^;Z/pz7ieCvvj|?Z;CBKiy+[3/TEsl');
define('LOGGED_IN_KEY',    '?$*<I-=L^#jC+yo8|s`UkAL74k{qbik/WFF F,>0qIq; $P@bqE8-C/~(wxF Q8(');
define('NONCE_KEY',        '4I-~~bL*iO>*Cx}E1&zDtH!qZxM>,LqaX43R<-WE*.f59WH_0(T.Q),aD*;p?zo ');
define('AUTH_SALT',        '*&L1r;A}Dd81nZBzV^[?g<|8B(Thgs42xIg%w5l_g_E-_Vw.rN P[K:q1UsY^|pU');
define('SECURE_AUTH_SALT', 'A_L?OTqwLY)-5UP3l{qLi|%TcKe9>HX>#+Sj!%$fZ@9p>4c1([UdO/b.+G-=_^;0');
define('LOGGED_IN_SALT',   'o4ubTC``_*cwAGf&{V_u}?<BY2.u.4RE=UYBy&MAREW;fAZ-R,(]pm*Z?IXwCZgH');
define('NONCE_SALT',       '7X%}*1|g]x#u>8NS%lII*yBULh%4nQQ0-thkjtNJkw/V-jlPT,mIic>Sf:V}}0;e');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
