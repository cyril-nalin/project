/**
 * 
 * A placer après les éléments de la page
 */


//eedit_block.style.display = 'none';
etitle_h1.textContent = 'Progression des tâches, bienvenue ' + user_name;

chartCtx = document.getElementById('myChart');
myChart = new Chart(chartCtx, {
    type: 'doughnut',
    data: {
    labels: ['A faire', 'Terminées'],
    datasets: [{
        label: 'Nombre de Tâches',
        data: [0, 100],
        backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
    }]
    },
    options: {
    scales: {
        x: {
            display: false
        },
        y: {
            beginAtZero: true,
            display: false
        }
    }
    }
});

displayTasksStats();
if(false === has_err) {
    callbackID = setInterval(displayTasksStats, STATS_REFRESH_INTERVAL)
}

