<?php

namespace CountryApi;

require_once 'InvalidApiResponseException.php';


use GuzzleHttp\Client;

class CountryApi
{
    /** @var Client */
    private $client;

    /**
     * CountryApi constructor.
     */
    public function __construct()
    {
        $this->client = new Client();
    }

    public function all($fields = [], $orderBy = null)
    {
        $this->generateResponse(getenv('COUNTRY_API_URL') . '/all', $fields, $orderBy);
    }

    public function name($name, $fullName = false, $fields = [])
    {
        $path = '/name/' . urlencode($name);
        $path = $fullName ? $path . '?fullText=true' : $path;
        $this->generateResponse($path, $fields);
    }

    public function code($isoCode, $fields = [])
    {
        $this->generateResponse($this->buildApiUrl('/alpha/' . urlencode($isoCode)), $fields);
    }

    public function codes(array $isoCodes, $fields = [])
    {
        $this->generateResponse(
            $this->buildApiUrl('/alpha?codes=' . urlencode(implode(';', $isoCodes)), $fields)
        );
    }

    public function currency($currency, $fields = [])
    {
        $this->generateResponse($this->buildApiUrl('/currency/' . urlencode($currency)), $fields);
    }

    public function language($language, $fields = [])
    {
        $this->generateResponse($this->buildApiUrl('/lang/' . urlencode($language)), $fields);
    }

    public function capital($capital, $fields = [])
    {
        $this->generateResponse($this->buildApiUrl('/capital/' . urlencode($capital)), $fields);
    }

    public function callingCode($callingCode, $fields = [])
    {
        $this->generateResponse($this->buildApiUrl('/callingCode/' . urlencode($callingCode)), $fields);
    }

    public function region($region, $fields = [])
    {
        $this->generateResponse($this->buildApiUrl('/region/' . urlencode($region)), $fields);

    }

    public function regionalBloc($regionalBloc, $fields = [])
    {
        $this->generateResponse($this->buildApiUrl('/regionalbloc/' . urlencode($regionalBloc), $fields));
    }

    private function buildApiUrl($path, $fields = [])
    {
        $fields = !empty($fields) ? implode(';', $fields) : $fields;
        $url = getenv('COUNTRY_API_URL') . urlencode($path);
        return !empty($fields) ? $url . '?fields=' . urlencode($fields) : $url;
    }

    private function generateResponse($url, $fields = [], $orderBy, $expectedResponse = 200)
    {
        try {
            if(!empty($fields)){
                $url .= '?fields=' . urlencode(implode(';', $fields));
            }
            $response = $this->makeApiRequest($url, $expectedResponse);
            $this->generateJsonResponse($response, $orderBy);
        } catch (\Exception $e) {
            $this->internalServerError($e);
        }
    }

    private function internalServerError(\Exception $e)
    {
        http_response_code(500);
        die(json_encode([
            'status' => 500,
            'message' => $e->getMessage(),
        ]));
    }

    private function generateJsonResponse($payload = [], $orderBy = null, $status = 200, $message = 'OK')
    {
        if(!empty($orderBy) && array_key_exists(array_key_first($orderBy), $payload[0])) {
            $key = array_key_first($orderBy);
            if(strtoupper($orderBy[$key] === 'ASC')) {
                usort($payload, function ($a, $b) use ($orderBy, $key) {
                    if($a->$key == $b->$key) {
                        return 0;
                    }
                    return $a->$key < $b->$key ? -1 : 1;
                });
            } elseif(strtoupper($orderBy[array_key_first($orderBy)]) === 'DESC') {
                usort($payload, function ($a, $b) use ($orderBy, $key) {
                    if($a->$key == $b->$key) {
                        return 0;
                    }
                    return $a->$key > $b->$key ? -1 : 1;
                });
            }

        }

        http_response_code(intval($status));
        if(getenv('ENVIRONMENT') !== 'development') {
            die(json_encode([
                'status' => $status,
                'message' => $message,
                'payload' => $payload
            ]));
        } else {
            die(json_encode([
                'status' => $status,
                'message' => $message,
                'payload' => $payload,
            ], JSON_PRETTY_PRINT));
        }
    }

    /**
     * @param $url
     * @param int $expectedStatusCode
     * @return bool|string
     * @throws InvalidApiResponseException
     * @throws CurlException
     */
    private function makeApiRequest($url, $expectedStatusCode = 200)
    {
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
        ));

        $response = curl_exec($curl);
        $statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $error = curl_error($curl);

        curl_close($curl);

        if ($error) {
            throw new CurlException("cURL error = \"{$error}\" when making request to Country API at {$url}");
        }

        if($statusCode !== $expectedStatusCode) {
            throw new InvalidApiResponseException("Invalid Country API Response: API returned a response with status code {$statusCode} instead of the expected status code of {$expectedStatusCode}");
        }


        return json_decode($response);
    }
}
