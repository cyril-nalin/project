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

etitle_h1.textContent = 'Gestion des tâches, bienvenue ' + user_name;
setupLogoutButton();
displayTasks(econtent);
