/**
 * 
 * A placer après les éléments de la page
 */
etitle_h1 = document.getElementById('main_title');
econtent = document.getElementById('subcontent');

eedit_block = document.getElementById('edit_block');



if(null === user_name) {
    window.document.location.assign('index.html');
}

//eedit_block.style.display = 'none';
etitle_h1.textContent = 'Progression des tâches, bienvenue ' + user_name;
setupLogoutButton();

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

