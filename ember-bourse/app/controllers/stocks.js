import Controller from '@ember/controller';
import $ from 'jquery';
import swal from 'sweetalert'

//TODO: refresh
export default Controller.extend({
    // STOCKS
    s_number: 1, // default stocks number
    // WALLET
    // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
    w_number: [], // default stocks number
    actions: {
        // STOCKS
        searchSymbol: function() { //TODO: fix submit
            let symbol = this.get("symbol");
            this.transitionToRoute('stocks', symbol);
        },
        setSelected: function(stock) {
            let ctrl = this;
            $.ajax({url: "http://localhost:3000/stocks/"+stock, type: 'get'}).then(function(data){
                ctrl.set('model.selected',data);
            })
            //this.send('sessionChanged');
        },
        buyStock: function(stock, nbr) {
            let ctrl = this;
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
                }).done(function() {
                    ctrl.send('refreshPage');
                });
            }
        },
        // WALLET
        sellStock: function(stock, nbr, prix, sym) {
            let ctrl = this;
            //$(event.target).data("id")
            if (!nbr || !parseInt(nbr)) {
                swal("Erreur", "Vous devez préciser un nombre d'actions valide.","error"); 
            } else {
                // Sans confirmation d'achat
                $.ajax({url: "http://localhost:3000/wallet/"+stock+"/sell",
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        nbr: nbr
                    }),
                    success: function(){
                        swal("Action vendue", "Vous avez vendu "+nbr+" actions "+sym+".","success");
                    },
                    error: function() {
                        swal("Erreur", "Une erreur s'est produite, l'action "+sym+" n'a pas été vendue.","error");                 
                    }
                })
                .done(function() {
                    ctrl.send('refreshPage');
                });
                // Avec confirmation d'achat (plus coûteux)
                /* $.ajax({url: "http://localhost:3000/stocks/"+sym, type: 'get'}).then(function(data){
                    if (data) {
                        let price = parseFloat(data["05. price"]);
                        let total = parseFloat(parseInt(nbr)*(price-parseFloat(prix))).toFixed(2);
                        swal({
                            title: 'Êtes-vous sûr(e) ?',
                            text: "Vous allez vendre "+nbr+" actions "+sym+" pour un gain total de "+total+" (prix actuel: "+price+")",
                            type: 'warning',
                            showCancelButton: true,
                            cancelButtonText: 'Annuler',
                            confirmButtonText: 'Confirmer'
                          }, function(result){
                            if (result) {
                                $.ajax({url: "http://localhost:3000/wallet/"+stock+"/sell",
                                    type: 'post',
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        nbr: nbr
                                    }),
                                    success: function(){
                                        swal("Action vendue", "Vous avez vendu "+nbr+" actions "+sym+".","success");
                                        ctrl.send('refreshPage');
                                    },
                                    error: function() {
                                        swal("Erreur", "Une erreur s'est produite, l'action "+sym+" n'a pas été vendue.","error");                 
                                    }
                                });
                            }
                          });
                    } else {
                        // 404 not found
                    }
                }).done(function() {
                    ctrl.send('refreshPage');
                }); */
            }
        }/* ,
        toInteger: function(string) {
            return parseInt(string);
        } */
    }
});
