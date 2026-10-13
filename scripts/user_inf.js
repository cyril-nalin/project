function CheckForm(){
    const euser_name = document.getElementById('user_name');

    //test si les elements existe, ne devrait pas arriver
    if(null == euser_name) {
        return false;
    }

    if(0 === euser_name.value.length) {
        return false;
    }


    return true;
}

document.querySelector('#user_inf').addEventListener('submit', function(event){
    const euser_name = document.getElementById('user_name');
    const euser_inf_err = document.getElementById('user_inf_err');
    event.preventDefault();

    if(false === CheckForm()) {
        euser_inf_err.textContent = 'Merci de saisir un nom.';
    } else {
        user_inf_err.textContent = ' ';
        localStorage.setItem('user_name', euser_name.value);
        window.document.location.assign('tasks.html');
    }
});
