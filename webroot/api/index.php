<?php

use CountryApi\CountryApi;

require '../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$countryApi = new CountryApi();

$countryApi->all([
    'name',
    'alpha2Code',
    'alpha3Code',
    'flag',
    'region',
    'subregion',
    'population',
    'languages'
], ['population' => 'DESC']);

/**
 * This is a template php file for your countries search.
 * Use as you will, or start over. It's up to you.
 */
 header('Content-Type: application/json');
 echo json_encode(['data' => ['Your data']]);
