import Route from '@ember/routing/route';
import $ from 'jquery';
import RSVP from 'rsvp';

export default Route.extend({
    actions: {
        refreshPage: function() {
            this.refresh();
        }
    },
    model(){
        let gains = $.ajax({url: "http://localhost:3000/gains", type: 'get'}); //TODO: handle error
        let total = $.ajax({url: "http://localhost:3000/gains/total", type: 'get'}); //TODO: handle error

        return RSVP.hash({
            gains: gains,
            total: total
        });
    }
});
