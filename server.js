const express = require('express')
const app = express()
const providers = require('./providers')

// set URLs
const btc2fiatUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin'
const nimiq2btcUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=nimiq-2&vs_currencies=btc'
const poloniexNimiqUrl = 'https://poloniex.com/public?command=returnTradeHistory&currencyPair=BTC_NIM'
const averageUrl = 'https://min-api.cryptocompare.com/data/generateAvg?fsym=NIM&tsym=BTC&e=Binance,Kraken,Poloniex,Bitfinex'
const btcLocalBitcoinsUrl = 'https://localbitcoins.com/bitcoinaverage/ticker-all-currencies'

// prettify json
app.set('json spaces', 2)

// setup cron job to pre-warm cache for common entries
const CronJob = require('cron').CronJob;

new CronJob('0 */1 * * * *', async function() {
  // wondering if maybe we don't run these seperately without 'await' we can run them async
  const USD = await providers.BTCCoingecko(btc2fiatUrl, ['USD'])
  console.log(`BTC/USD: ${USD.USD}`)
  // console.log(`Poloniex: ${await providers.NIMIQPoloniex(poloniexNimiqUrl)}`)
  // console.log(`NIMIQ Average: ${await providers.NIMIQCryptoCompareAvg(averageUrl)}`)
  console.log(`BTC/NIMIQ: ${await providers.CoingeckoNimiqBtc(nimiq2btcUrl)}`)
  console.log(`LocalBitcoins Rates: ${await providers.BTCLocalBitcoins(btcLocalBitcoinsUrl)}`)

  console.log('Cache Refreshed');

}, null, true, 'America/Los_Angeles', null, true);

// ignore favicon
app.use(function(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({
      nope: true
    })
  } else {
    next()
  }
})

// access control allow headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use('/static', express.static(__dirname + '/public'))

// docs at '/'
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/docs/index.html')
})

// verification token for loader.io testing - this is not necessary if running your own instance
app.get('/loaderio-5c8ed429de43ac44e439a90752086c1d', function(req, res) {
  res.sendFile(__dirname + '/public/loaderio-5c8ed429de43ac44e439a90752086c1d.txt')
})

// get CryptoCompare average trading price
app.get('/avg', async function(req, res) {
  let price = await providers.NIMIQCryptoCompareAvg(averageUrl)
  res.json(price)
})

// get Poloniex trading price
app.get('/poloniex', async function(req, res) {
  let price = await providers.NIMIQPoloniex(poloniexNimiqUrl)
  res.json(price)
})

// get Coingecko trading price
app.get('/coingecko', async function(req, res) {
  let price = await providers.CoingeckoNimiqBtc(nimiq2btcUrl)
  res.json(price)
})

app.get('/invoice', async function(req, res) {
  // http://localhost:3000/invoice?addr=NQXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX&amount=22500
  const address = req.query.addr
  const amount = parseInt(req.query.amount)

  res.json(await providers.invoice(address, amount))
})

app.get('/nimiqtext', async function(req, res) {
  // http://localhost:3000/nimiqtext?addr=NQXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX XXXX&amount=22500
  const address = req.query.addr
  const amount = parseInt(req.query.amount)

  res.json(await providers.nimiqText(address, amount))
})

// get rates
app.get('/*', async function(req, res) {
  const params = req.params[0].split('/')
  let currencies = params.map(currency => currency.toUpperCase())
  // if we want all rates, we simply pass the 'list' parameter
  if (currencies[0] === "LIST") {
    currencies = ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN",
      "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLF", "CLP",
      "CNH", "CNY", "COP", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR",
      "FJD", "FKP", "GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF",
      "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW",
      "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT",
      "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB",
      "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK",
      "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SVC", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY",
      "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XCD",
      "XDR", "XOF", "XPD", "XPF", "XPT", "YER", "ZAR", "ZMW", "ZWL"
    ]
  }
  console.log(`get rate: ${currencies}`)
  try {
    // get current average BTC/FIAT and BTC/NIMIQ exchange rate
    const rates = await providers.BTCCoingecko(btc2fiatUrl, currencies)
    const avg = NaN
    // const avg = await providers.NIMIQCryptoCompareAvg(averageUrl)
    // const poloniex = await getPoloniexNimiq(poloniexNimiqUrl)
    const nimiq = await providers.CoingeckoNimiqBtc(nimiq2btcUrl)
    // 'rates' is an object containing requested fiat rates (ex. USD: 6500)
    // multiply each value in the object by the current BTC/NIMIQ rate
    for (var key of currencies) {
      if (typeof rates[key] !== 'number') {
        rates[key] = await providers.BTCLocalBitcoins(btcLocalBitcoinsUrl, key)
      }
      // rates[key] *= poloniex
      rates[key] *= avg || nimiq
    }
    // return the rates object
    res.json(rates)
  } catch (e) {
    // this will eventually be handled by error handling middleware
    res.send(`error: ${e}`)
    console.log(e)
  }
})

// set server
const port = process.env.PORT || 3000;
app.listen(port);
console.log(`NimiqRates API v0.2.6 running on port http://localhost:${port}`);
