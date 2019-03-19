import Route from '@ember/routing/route';
import $ from 'jquery';
import RSVP from 'rsvp';

export default Route.extend({
    actions: {
        refreshPage: function() {
            this.refresh();
            this.send("drawChart");
        },
        drawChart: function() {
            // Format date
            let options = { year: 'numeric', month: 'numeric', day: 'numeric' };

            // Data
            $.ajax({url: "http://localhost:3000/gains", type: 'get'}).then(function(data){  
            data.reverse()    
            let gains = data.map((x, index) => {
                    if (index>0) {
                        x["amount"]+=data[index-1]["amount"]
                    }  
                    return x;
                });
                // Chart
            var ctx = document.getElementById('myChart').getContext('2d');
            var config = {
              // The type of chart we want to create
              type: 'line',
      
              // The data for our dataset
              //TODO: reverse
              data: {
                  labels: gains.map(x => {return new Date(x["date"]).toLocaleDateString('fr-FR',options)}),//["2019-01-01", "2019-01-01", "2019-01-19", "2019-01-21"],
                  datasets: [{
                      label: "Gain total (€)",
                      backgroundColor: 'rgb(255, 99, 132)',
                      borderColor: 'rgb(255, 99, 132)',
                      data: gains.map(x => {return parseFloat(x["amount"]).toFixed(2)}),
                      fill: false
                  }]
              },
      
              // Configuration options go here
              options: {
                responsive: true,
                title: {
                  display: true,
                  text: 'Gains'
                },
                tooltips: {
                  mode: 'index',
                  intersect: false,
                },
                hover: {
                  mode: 'nearest',
                  intersect: true
                },
                scales: {
                  xAxes: [{
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'Date'
                    }
                  }],
                  yAxes: [{
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'Montant (€)'
                    }
                  }]
                }
              }
            }
            var chart = new Chart(ctx,config);
            });
            
        }
    },
    // CHART
    activate: function() {
        let route = this;
        $( document ).ready(function(){
            route.actions.drawChart();            
        });
    },
    //TODO: handle localhost access error ??
    model(params){
        // STOCKS
        let stocks = [];
        let selected = null;

        if (params.symbol) {
            stocks = $.ajax({url: "http://localhost:3000/stocks?search="+params.symbol, type: 'get'});
        }

        // WALLET
        let wallet = $.ajax({url: "http://localhost:3000/wallet", type: 'get'});

        // GAINS
        let gains = $.ajax({url: "http://localhost:3000/gains?limit=10", type: 'get'});
        let total = $.ajax({url: "http://localhost:3000/gains/total", type: 'get'});

        return RSVP.hash({
            // STOCKS
            stocks: stocks,
            selected: selected,
            // WALLET
            wallet: wallet,
            // GAINS
            gains: gains,
            total: total
        });
    }
});

