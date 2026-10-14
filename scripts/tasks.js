/**
 * 
 * A placer après les éléments de la page
 */


//eedit_block.style.display = 'none';
etitle_h1.textContent = 'Gestion des tâches, bienvenue ' + user_name;
setupLogoutButton();
displayTasks();

if(false === has_err) {
    callbackID = setInterval(displayTasksStats, STATS_REFRESH_INTERVAL);
}
