# NimiqRates REST API Documentaion

## Installation

Clone repo
`git clone https://github.com/rraallvv/NimiqRates-API.git nimiqrates-api`

Change into directory
`cd nimiqrates-api`

Install NPM packages
`npm install`

Start server
`npm run start`

## Public API Methods

### Get specific exchange rates

- #### Endpoint
    `https://host.com/currency`
    #### Example:
    `https://api.get-spark.com/usd`

- #### Response
    ```js
    {
      "USD": 156.2038601617581
    }
    ```

If a currency is not supported, you will receive an empty object

### Get multiple exchange rates

- #### Endpoint
    `https://host.com/currency1/currency2`
    #### Example:
    `https://api.get-spark.com/usd/eur`

- #### Response
    ```js
    {
      "USD": 156.2038601617581,
      "EUR": 137.0866747655785
    }
    ```

This endpoint is useful for if you need more than one rate.

### Get all supported exchange rates

- #### Endpoint
    `https://host.com/list`
    #### Example:
    `https://api.get-spark.com/list`

- #### Response
    ```js
    {
      "AED": 574.026572712993,
      "AFN": 11788.882458857015,
      "ALL": 17080.119937199943,
      "AMD": 75628.34761208357,
      "ANG": 276.3735334656629,
      "AOA": 47947.766240431934,
      "ARS": 5726.825290792548,
      "AUD": 220.44862876746885
      // +159 more

    }
    ```
This endpoint returns an object with every supported currency, in alphabetical order.

There are currently 167 supported exchange rates.

### Get average NIMIQ trading price

- #### Endpoint
    `https://host.com/avg`
    #### Example:
    `https://api.get-spark.com/avg`

- #### Response
    ```js
    0.02474
    ```
This is the average NIMIQ price across Binance, Kraken, Poloniex, and Bitfinex

### Get Coingecko NIMIQ trading price

- #### Endpoint
    `https://host.com/coingecko`
    #### Example:
    `https://api.get-spark.com/coingecko`

- #### Response
    ```js
    0.02412598
    ```

### Get Poloniex NIMIQ trading price

- #### Endpoint
    `https://host.com/poloniex`
    #### Example:
    `https://api.get-spark.com/poloniex`

- #### Response
    ```js
    0.024089169894995932
    ```
This is an average of the price paid for the last 200 trades on Poloniex

### Supported Currencies
```js
AED, AFN, ALL, AMD, ANG, AOA, ARS, AUD, AWG, AZN, BAM, BBD, BDT, BGN, BHD, BIF, BMD, BND, BOB, BRL, BSD, BTN, BWP, BYN, BZD, CAD, CDF, CHF, CLF, CLP, CNH, CNY, COP, CRC, CUC, CUP, CVE, CZK, DJF, DKK, DOP, DZD, EGP, ERN, ETB, EUR, FJD, FKP, GBP, GEL, GGP, GHS, GIP, GMD, GNF, GTQ, GYD, HKD, HNL, HRK, HTG, HUF, IDR, ILS, IMP, INR, IQD, IRR, ISK, JEP, JMD, JOD, JPY, KES, KGS, KHR, KMF, KPW, KRW, KWD, KYD, KZT, LAK, LBP, LKR, LRD, LSL, LYD, MAD, MDL, MGA, MKD, MMK, MNT, MOP, MRO, MUR, MVR, MWK, MXN, MYR, MZN, NAD, NGN, NIO, NOK, NPR, NZD, OMR, PAB, PEN, PGK, PHP, PKR, PLN, PYG, QAR, RON, RSD, RUB, RWF, SAR, SBD, SCR, SDG, SEK, SGD, SHP, SLL, SOS, SRD, SSP, STD, SVC, SYP, SZL, THB, TJS, TMT, TND, TOP, TRY, TTD, TWD, TZS, UAH, UGX, USD, UYU, UZS, VES, VND, VUV, WST, XAF, XAG, XAU, XCD, XDR, XOF, XPD, XPF, XPT, YER, ZAR, ZMW, ZWL
```
