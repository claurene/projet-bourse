import Route from '@ember/routing/route';
import $ from 'jquery';

export default Route.extend({
    actions: {
        refreshPage: function() {
            this.refresh();
        }
    },
    model(){

        let wallet = $.ajax({url: "http://localhost:3000/wallet", type: 'get'}); //TODO: handle error

        return wallet;
    }
});
