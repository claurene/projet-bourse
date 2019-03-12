import Controller from '@ember/controller';
import $ from 'jquery';
import swal from 'sweetalert'

export default Controller.extend({
    number: 1, // default stocks number
    actions: {
        searchSymbol: function() {
            let symbol = this.get("symbol");
            this.transitionToRoute('stocks', symbol);
        },
        setSelected: function(stock) {
            let ctrl = this;
            $.ajax({url: "http://localhost:3000/stocks/"+stock, type: 'get'}).then(function(data){
                ctrl.set('model.selected',data);
            });
            //this.send('sessionChanged');
        },
        buyStock: function(stock, nbr) {
            //let ctrl = this;
            if (!nbr || !parseInt(nbr)) {
                swal("Erreur", "Vous devez préciser un nombre d'actions valide.","error"); 
            } else {
                $.ajax({url: "http://localhost:3000/stocks/"+stock+"/buy",
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        nbr: nbr
                    }),
                    success: function(){
                        swal("Action achetée", "Vous avez acheté "+nbr+" actions "+stock+".","success");
                    },
                    error: function() {
                        swal("Erreur", "Une erreur s'est produite, l'action "+stock+" n'a pas été achetée.","error");                 
                    }
                });
            }
        }
    }
});
