const request = require('request');

// wrap a request in an promise
function downloadPage(url) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) reject(error);
      if (response.statusCode != 200) {
        reject('Invalid status code <' + response.statusCode + '>');
      }
      resolve(body);
    });
  });
}

const coins = [
  'AED',
  'AFN',
  'ARS',
  'AUD',
  'BBD',
  'BDT',
  'BGN',
  'BHD',
  'BMD',
  'BND',
  'BOB',
  'BRL',
  'BTN',
  'BYN',
  'BZD',
  'CAD',
  'CHF',
  'CLP',
  'CNY',
  'COP',
  'CRC',
  'CZK',
  'DKK',
  'DOP',
  'EGP',
  'ETB',
  'EUR',
  'GBP',
  'GEL',
  'GHS',
  'GMD',
  'GYD',
  'HKD',
  'HRK',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'ISK',
  'JMD',
  'JPY',
  'KES',
  'KRW',
  'KWD',
  'KYD',
  'KZT',
  'LAK',
  'LKR',
  'LRD',
  'LTL',
  'MAD',
  'MDL',
  'MKD',
  'MNT',
  'MUR',
  'MWK',
  'MXN',
  'MYR',
  'MZN',
  'NAD',
  'NGN',
  'NIO',
  'NOK',
  'NPR',
  'NZD',
  'OMR',
  'PEN',
  'PGK',
  'PHP',
  'PKR',
  'PLN',
  'PYG',
  'QAR',
  'RON',
  'RSD',
  'RUB',
  'SAR',
  'SEK',
  'SGD',
  'SOS',
  'SRD',
  'SSP',
  'THB',
  'TRY',
  'TTD',
  'TWD',
  'TZS',
  'UAH',
  'UGX',
  'USD',
  'UYU',
  'VES',
  'VND',
  'YER',
  'ZAR'
];

(async function () {
  console.log('getting rates...')
  let rates
  let nimbtc
  try {
    rates = JSON.parse(await downloadPage('https://localbitcoins.com/bitcoinaverage/ticker-all-currencies/'))
    nimbtc = (JSON.parse(await downloadPage('https://api.coingecko.com/api/v3/simple/price?ids=nimiq-2&vs_currencies=btc')))['nimiq-2']['btc']  
  } catch(e) {
    console.log(e)
  }
  for (coin of coins) {
    try {
      const html = JSON.parse(await downloadPage(`https://api.nimizuela.org/${coin.toLowerCase()}`))
      if (!html[coin]) {
        console.log(coin);
      }
    } catch(e) {
      console.log(e)
    }
  }
})()

/*
AFN
BBD
BGN
BND
BTN
BZD
ETB
GMD
GYD
ISK
KYD
LAK
LRD
LTL
MDL
MKD
MNT
MUR
MZN
NAD
NIO
NPR
PGK
SOS
SRD
SSP
TTD
YER
*/
