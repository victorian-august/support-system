<?php
/*
 * Plugin Name: uCare - Support Ticket System
 * Author: Smartcat
 * Description: If you have customers, then you need uCare. A support ticket help desk for your customers featuring usergroups,agents,ticket status,filtering,searching all in one responsive app. The most robust support ticket system for WordPress. 
 * Version: 1.2.1
 * Author: Smartcat
 * Author URI: https://smartcatdesign.net
 * License: GPL V2
 * 
 */

namespace ucare;

// Die if access directly
if( !defined( 'ABSPATH' ) ) {
    die();
}

const PLUGIN_ID = 'smartcat_support';
const PLUGIN_VERSION = '1.2.1';

// Pull in manual includes
include_once 'loader.php';


// Boot up the container
Plugin::boot( PLUGIN_ID, PLUGIN_VERSION, __FILE__ );
