document.querySelector('#user_inf').addEventListener('submit', function(event){
    const user_name = document.getElementById('user_name').value.trim();
    const euser_inf_err = document.getElementById('user_inf_err');
    event.preventDefault();

    if(0 === user_name.length) {
        euser_inf_err.textContent = 'Merci de saisir un nom.';
    } else {
        user_inf_err.textContent = ' ';
        localStorage.setItem('user_name', user_name);
        window.document.location.assign('tasks.html');
    }
});
