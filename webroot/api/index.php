<?php

use CountryApi\CountryApi;

require '../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$countryApi = new CountryApi();

if(!empty($_GET['search'])) {
    $countryApi->search($_GET['search'], [
        'name',
        'alpha2Code',
        'alpha3Code',
        'flag',
        'region',
        'subregion',
        'population',
        'languages'
    ], ['population' => 'DESC']);
} else {
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
}
