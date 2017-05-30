<?php

use smartcat\form\Form;
use smartcat\form\SelectBoxField;
use smartcat\form\TextBoxField;
use ucare\form\CheckBoxGroup;
use ucare\Plugin;

$form = new Form( 'ticket_filter' );
$plugin = Plugin::get_plugin( \ucare\PLUGIN_ID );
$agents = \ucare\util\list_agents();
$products = \ucare\util\products();

if( \ucare\util\ecommerce_enabled() ) {

    $form->add_field( new SelectBoxField(
        array(
            'id'      => 'product',
            'name'    => 'meta[product]',
            'label'   => __( 'Product', 'ucare' ),
            'class'   => array( 'filter-field', 'form-control' ),
            'options' => array( 0 => __( 'All Products', 'ucare' ) ) + $products
        )

    ) );

}

if( current_user_can( 'manage_support_tickets' ) ) {

    $form->add_field( new SelectBoxField(
        array(
            'id'      => 'agent',
            'name'    => 'agent',
            'label'   => __( 'Agent', 'ucare' ),
            'class'   => array( 'filter-field', 'form-control' ),
            'options' => array(
                 0 => __( 'All Agents', 'ucare' ),
                -1 => __( 'Unassigned', 'ucare' ) ) + $agents
        )

    ) );

    $form->add_field(new TextBoxField(
        array(
            'id'    => 'email',
            'name'  => 'email',
            'label' => __( 'Email', 'ucare' ),
            'type'  => 'email',
            'class' => array('filter-field', 'form-control')
        )

    ));
}

$form->add_field( new CheckBoxGroup(
    array(
        'id'      => 'status',
        'name'    => 'meta[status]',
        'label'   => __( 'Status', 'ucare' ),
        'value'   => \ucare\util\filter_defaults()['status'],
        'class'   => array( 'filter-field' ),
        'options' => \ucare\util\statuses()
    )

) );

return $form;
