const axios = require('axios')
const cache = require('./cache')

// get bitcoin's average price against various fiat currencies
exports.BTCCoingecko = function(url, [...currencies]) {
  const output = {}
  const cacheRef = '_cachedCoingeckoFor_' + currencies

  return new Promise(resolve => {
    cache.get(cacheRef, function(error, data) {
      if (error) throw error
      // if the data is in cache, return that
      if (!!data) {
        resolve(JSON.parse(data))
     } else {
        axios.get(url + '&vs_currencies=' + currencies.join())
          .then(async result => {
            // for each currency passed into this function, we add a key/value to output (ex. USD: 6500.12345)
            for (var currency of currencies) {
              // use the "last" price from bitcoinaverage to give us the most recent exchange rate
              output[currency] = result.data['bitcoin'][currency.toLowerCase()]
            }
            // set the cache for this response and save for 60 seconds
            cache.setex(cacheRef, 60, JSON.stringify(output));
            // resolve an object containing all requested currencies
            resolve(output)
          })
          .catch(error => {
            console.log(`Error: ${error}`)
            resolve(error)
          })
      }
    })
  })
}

// get nimiq's average trading price from various exchanges
exports.NIMIQCryptoCompareAvg = function(url) {
  let output = {}
  const cacheRef = '_cachedCryptoCompareAvg'

  return new Promise(resolve => {
    cache.get(cacheRef, function(error, data) {
      if (error) throw error
      // if the data is in cache, return that
      if (!!data) {
        resolve(JSON.parse(data))
        console.log('Grabbed _cachedCryptoCompareAvg')
      } else {
        axios.get(url)
          .then(async result => {
            // the output should equal the average price (ex. 0.02528)
            output = parseFloat(result.data.RAW.PRICE)
            // set the cache for this response and save for 60 seconds
            cache.setex(cacheRef, 60, JSON.stringify(output))
            // resolve an object containing all requested currencies
            resolve(output)
          })
          .catch(error => {
            console.log(`Error: ${error}`)
            resolve(error)
          })
      }
    })
  })
}

// get the current NIMIQ trading price from Poloniex
exports.NIMIQPoloniex = function(url) {
  const cacheRef = '_cachedPoloniexNimiq'

  return new Promise(resolve => {
    cache.get(cacheRef, function(error, data) {
      if (error) throw error
      // if the data is in cache, return that
      if (!!data) {
        resolve(JSON.parse(data))
        console.log('Grabbed _cachedPoloniexNimiq')
      } else {
        axios.get(url)
          .then(result => {
            let total = 0
            let amount = 0
            // loop through the results and get the total BTC traded, and the amount of NIMIQ traded
            for (var i = 0; i < result.data.length; i++) {
              total += parseFloat(result.data[i].total)
              amount += parseFloat(result.data[i].amount)
            }
            // get the average price paid for the last 200 trades
            let average = total / amount
            // set the cache for this response and save for 60 seconds
            cache.setex(cacheRef, 60, JSON.stringify(average))
            resolve(average)
          })
          .catch(error => {
            console.log(`Error: ${error}`)
            resolve(false)
          })
      }
    })
  })
}

// get the current BTC/NIMIQ price - we grab the "last" price from bitcoinaverage to get the most recent exchange rate
exports.CoingeckoNimiqBtc = function (url) {
  const cacheRef = '_cachedNimiqBTC'

  return new Promise(resolve => {
    cache.get(cacheRef, function(error, data) {
      if (error) throw error
      // if the data is in cache, return that
      if (!!data) {
        resolve(JSON.parse(data))
        console.log('Grabbed _cachedNimiqBTC')
      } else {
        axios.get(url)
          .then(result => {
            const last = result.data['nimiq-2']['btc']
            // set the cache for this response and save for 60 seconds
            cache.setex(cacheRef, 60, JSON.stringify(last))
            resolve(last)
          })
          .catch(error => {
            console.log(`Error: ${error}`)
            resolve(error)
          })
      }
    })
  })
}

//get the current BTC/VES price from LocalBitcoins API
exports.BTCLocalBitcoinsVes = function (url) {
  const cacheRef = '_cachedNimiqLocalBitcoinsVes'

  return new Promise(resolve => {
    cache.get(cacheRef, function (error, data) {
      if (error) throw error
      // if the data is in cache, return that
      if (!!data) {
        resolve(JSON.parse(data))
        console.log(`Grabbed _${cacheRef}`)
      } else {
        axios.get(url)
          .then(result => {
            const btcVes = parseFloat(result.data['VES']['rates']['last'])
            // set the cache for this response and save for 60 seconds
            cache.setex(cacheRef, 60, btcVes)
            resolve(btcVes)
          }).catch(error => {
            console.log(`Error: ${error}`)
            resolve(error)
          })
      }
    })
  })
}

// get invoice number from CoinText
exports.invoice = function(address, amount) {
  return new Promise(resolve => {
    const data = {
      'address': address,
      'amount': amount,
      'network': 'nimiq',
      'api_key': process.env.API_KEY
    }

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }

    axios.post('https://pos-api.cointext.io/create_invoice/', data, headers)
      .then((res) => {
        console.log(res.data)
        resolve(res.data.paymentId)
      })
      .catch((err) => {
        console.log(err)
        resolve(err)
      })
  })
}

// get invoice number from NimiqText
exports.nimiqText = function(address, amount) {
  return new Promise(resolve => {

    const token = process.env.NIMIQ_TEXT
    const data = `address=${address}&amount=${amount}&token=${token}`

    const headers = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }

    axios.post('https://api.nimiqtext.io/apibuy.php', data)
      .then((res) => {
        console.log(res.data)
        resolve(res.data.code)
      })
      .catch((err) => {
        console.log(err)
        resolve(err)
      })
  })
}
