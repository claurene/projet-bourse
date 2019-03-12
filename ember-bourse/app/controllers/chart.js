import Controller from '@ember/controller';

export default Controller.extend({
    actions: {
        /* createChart: function(){
            // Chart
            var ctx = document.getElementById('myChart').getContext('2d');
            var config = {
              // The type of chart we want to create
              type: 'line',
      
              // The data for our dataset
              data: {
                  labels: ["2019-01-01", "2019-01-01", "2019-01-19", "2019-01-21"],
                  datasets: [{
                      label: "Gain total (€)",
                      backgroundColor: 'rgb(255, 99, 132)',
                      borderColor: 'rgb(255, 99, 132)',
                      data: [0, 1000, 784.92, 676.7],
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
                      labelString: 'Month'
                    }
                  }],
                  yAxes: [{
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'Value'
                    }
                  }]
                }
              }
            }
            var chart = new Chart(ctx,config);
          } */
    }
});
