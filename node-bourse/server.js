let express = require('express');
let bodyParser = require('body-parser');
let request = require('request');
let app = express();

app.use(bodyParser.json());
app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

let mongoose = require('mongoose');
let db = mongoose.connect('mongodb://localhost/server', { useNewUrlParser: true });

const API_KEY = process.env.API_KEY;

let StockSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: Number
});
let Stock = mongoose.model('Stock', StockSchema);

let WalletSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: Number,
  nbr: {
    type: Number,
    default: 1
  },
  date: {
    type: Date,
    default: Date.now
  }
});
let Wallet = mongoose.model('Wallet', WalletSchema);

let GainSchema = new mongoose.Schema({
  amount: Number,
  date: {
    type: Date,
    default: Date.now
  }
});
let Gain = mongoose.model('Gain', GainSchema);

/* let s = new Stock({
  name: 'Apple',
  symbol: 'AAPL',
  price: 12.3
});
s.save(); */

/* {
    "Global Quote": {
        "01. symbol": "MSFT",
        "02. open": "107.9100",
        "03. high": "108.3000",
        "04. low": "107.3624",
        "05. price": "108.2200",
        "06. volume": "6016",
        "07. latest trading day": "2019-02-15",
        "08. previous close": "106.9000",
        "09. change": "1.3200",
        "10. change percent": "1.2348%"
    }
} */

/* {
    "bestMatches": [
        {
            "1. symbol": "AMD",
            "2. name": "Advanced Micro Devices Inc.",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.5000"
        },
        {
            "1. symbol": "MU",
            "2. name": "Micron Technology Inc.",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "0.4545"
        } */

app.get('/', (req, res) => {
  res.send('Hello World !');
});

// ROUTES STOCKS
app.route('/stocks') //stocks?search=sym
  .get((req, res, next) => {
    /* Stock.find({}, (err, stocks) => {
      if (err) {
        return next(err);
      } else {
        res.json(stocks);
      }
    }); */
    let sym = req.query.search;
    request('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords='+sym+'&apikey='+API_KEY, { json: true }, (err, resp, body) => {
      if (err) { 
        return next(err); 
      } else {
        res.json(body["bestMatches"]);
      }
    });
  });
app.route('/stocks/:sym')
  .get((req, res, next) => {
    /* Stock.findOne({symbol: req.params.sym}, (err, stock) => {
      if (err) {
        return next(err);
      } else {
        res.json(stock);
      }
    }); */
    //https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo
    let sym = req.params.sym;
    request('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+sym+'&apikey='+API_KEY, { json: true }, (err, resp, body) => {
      if (err) { 
        return next(err); 
      } else {
        res.json(body["Global Quote"]); //TODO: handle 404
      }
    });
  });
app.route('/stocks/:sym/buy')
  .post((req, res, next) => {
    // On cherche plutot que cliquer sur une action déjà affichée afin d'avoir les infos mises à jour.
    //Stock.findOne({symbol: req.params.sym}, (err, stock) => {
    let sym = req.params.sym;
    request('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+sym+'&apikey='+API_KEY, { json: true }, (err, resp, body) => {
      if (err) {
        return next(err);
      } else if (body["Global Quote"]) { //TODO: verif ??
        // TODO: parse body
        let stock = new Stock({
          name: "dummy", //TODO
          symbol: body["Global Quote"]["01. symbol"],
          price: body["Global Quote"]["05. price"]
        })
        let nbrStock = 1;
        if (req.body.nbr != undefined) {
          try {
            nbrStock = parseInt(req.body.nbr)
          } catch (error) {
            console.log("Specified 'nbr' is not a Number");
            // nbrStock will be NaN
          }
        }
        // Simple : ajouter un nouvel item dans le portefeuille (plus tard on pourra peut-être regrouper par SYM + PRICE)
        let wallet = new Wallet({
          name: stock.name,
          symbol: stock.symbol,
          price: stock.price,
          nbr:  nbrStock ? nbrStock : 1
        })
        wallet.save((err) => {
          if (err) {
            return next(err);
          } else {
            // update GAINS
            let gain = new Gain({
              amount: -1*wallet.price*wallet.nbr //TODO: check
            });
            gain.save((err) => {
              if (err) {
                return next(err);
              } else {
                res.json(wallet);
              }
            })
          }
        });
      } else {
        // pas de stock trouvé -> 404
        res.status(404).json(null);
      }
    });
  }) 

// ROUTES WALLET
app.route('/wallet')
  .get((req, res, next) => {
    Wallet.find({}, {}, {sort: { 'date' : -1 }}, (err, wallets) => {
      if (err) {
        return next(err);
      } else {
        res.json(wallets);
      }
    });
  });
app.route('/wallet/:id')
  .get((req, res, next) => {
    Wallet.findById(req.params.id, (err, wallet) => {
      if (err) {
        return next(err);
      } else {
        res.json(wallet);
      }
    });
  });
app.route('/wallet/:id/sell')
  .post((req, res, next) => {
    //TODO: update GAINS, récup prix de l'action dans Stock
    Wallet.findById(req.params.id, (err, wallet) => {
      if (err) {
        return next(err);
      } else if (wallet) {
        let nbrStock = 1;
        if (req.body.nbr != undefined) {
          try {
            nbrStock = parseInt(req.body.nbr)
          } catch (error) {
            console.log("Specified 'nbr' is not a Number");
            // nbrStock will be NaN
            nbrStock = 1;
          }
        }
        // Récup prix de l'action
        let sym = wallet.symbol;
        request('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol='+sym+'&apikey='+API_KEY, { json: true }, (err, resp, stock) => {
          if (err) { 
            return next(err); 
          } else {
            // Vente
            if (wallet.nbr>nbrStock) {
              // On vend une partie
              wallet.nbr -= nbrStock;
              wallet.save((err) => {
                if (err) {
                  return next(err);
                }/*  else {
                  // Return 204 no content
                  res.json(wallet);
                } */
              });
            } else {
              // On vend tout
              Wallet.remove({_id: req.params.id}, (err) => {
                if (err) {
                  return next(err);
                }/*  else {
                  // Return 204 no content
                  return res.json(null);
                } */
              });
            }
            // Update gains
            //TODO: attention undefined stock !!!
            let gain = new Gain({
              amount: stock["Global Quote"]["05. price"]*wallet.nbr //TODO: check
            });
            gain.save((err) => {
              if (err) {
                return next(err);
              } else {
                // Return 204 no content
                res.status(204).json(null);
              }
            })
          }
        });
      } else {
        // Return 404 not found
        return res.status(404).json(null);
      }
    });
  });

// ROUTES GAIN
app.route('/gains')
  .get((req, res, next) => {
    Gain.find({}, {}, {sort: { 'date' : -1 }, limit:parseInt(req.query.limit)}, (err, gains) => {
      if (err) {
        return next(err);
      } else {
        res.json(gains);
      }
    });
  });
app.route('/gains/total')
  .get((req, res, next) => {
    Gain.aggregate([
      {$group: {
        _id: {},
        total: {$sum: '$amount'}
      }}
    ], (err, gain)=> {
      if (err) {
        return next(err);
      } else {
        res.json(gain[0].total); //TODO: handle error ?
      }
    });
  });


/* .post((req, res, next) => {
  let stock = new Stock(req.body);
  stock.save((err) => {
    if (err) {
      return next(err);
    } else {
      res.json(stock);
    }
  });
}); */

//app.use(express.static('./public'));

app.listen(3000);
console.log("Server running....");

// app.get() 
// app.route(path).get(callback).post(callback)

// req.query
// req.params
// req.param(name)
// req.body
// req.path, req.host, req.ip
// req.cookies

// res.status
// res.set
// res.cookie
// res.redirect
// res.send
// res.json


/* 
//DEBUG UNIQUEMENT : group wallet by stock and price
  .get((req, res, next) => {
    // Grouper par prix
    Wallet.aggregate([
      {$match: {symbol: "GOOG", price: 10.2}},
      {$group: {
        _id: {symbol: '$symbol', price: '$price'},
        nbr: {$sum: '$nbr'}
        //symbol: {$first: '$symbol'},
        //price: {$first: '$price'},
      }}
    ], (err, wallet)=> {
      if (err) {
        return next(err);
      } else {
        res.json(wallet[0].nbr);
      }
    });
  }) */