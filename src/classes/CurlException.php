<?php


namespace CountryApi;


use Throwable;

class CurlException extends \Exception
{

    /**
     * InvalidApiResponseException constructor.
     */
    public function __construct($message = "", $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
