import Controller from '@ember/controller';
import $ from 'jquery';
import swal from 'sweetalert'

export default Controller.extend({
    // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
    number: [], // default stocks number
    actions: {
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
                        ctrl.send('refreshPage');
                    },
                    error: function() {
                        swal("Erreur", "Une erreur s'est produite, l'action "+sym+" n'a pas été vendue.","error");                 
                    }
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
                }); */
            }
        },
        toInteger: function(string) {
            return parseInt(string);
        }
    }
});

/* 
swalWithBootstrapButtons.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, delete it!',
  cancelButtonText: 'No, cancel!',
  reverseButtons: true
}).then((result) => {
  if (result.value) {
    swalWithBootstrapButtons.fire(
      'Deleted!',
      'Your file has been deleted.',
      'success'
    )
  } else if (
    // Read more about handling dismissals
    result.dismiss === Swal.DismissReason.cancel
  ) {
    swalWithBootstrapButtons.fire(
      'Cancelled',
      'Your imaginary file is safe :)',
      'error'
    )
  }
})
 */
