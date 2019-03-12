import Route from '@ember/routing/route';
import $ from 'jquery';
import RSVP from 'rsvp';

export default Route.extend({
    /* actions: {
        sessionChanged: function() {
            alert('session changed');
            //this.refresh();
        }
    }, */
    model(params){
        let stocks = [];
        let selected = null;

        if (params.symbol) {
            stocks = $.ajax({url: "http://localhost:3000/stocks?search="+params.symbol, type: 'get'});
            //return stocks;
        }        
        /* let selectedStock = this.controllerFor("stocks").get("selectedStock");
        if (selectedStock) {
            selected = $.ajax({url: "http://localhost:3000/stocks/"+selectedStock, type: 'get'});
        } */

        return RSVP.hash({
            stocks: stocks,
            selected: selected
        });
    }
});

