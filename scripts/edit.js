/**
 * 
 * A placer après les éléments de la page
 */
const params = new URLSearchParams(document.location.search);
const add_mode = params.has('add') ? ('true' === params.get('add')) : false;

if(!add_mode && !params.has('id')) {
    gotoIndex();
}

const id = params.get('id');
if(!add_mode && Number(id) <= 0) {
    alert('Tâche introuvable, retour à la liste.');
    document.location.assign('tasks.html');
}

setupLogoutButton();

const eedit_title_task = document.getElementById('edit_title_task');
const eedit_tags_task = document.getElementById('edit_tags_task');
const eedit_state_task = document.getElementById('edit_state_task');

function getTaskData() {
    doFetch('/todos/' + id)
    .then( function(response) {
        if(!response.ok) {
            throw('Impossible de récuperer les données pour cette tâche.');
        }
        return response.json();
    } )
    .then(data => {
        let s = '';
        eedit_title_task.value = data.text;
        //console.log(data.Tags);
        data.Tags.forEach(tag => {
            if(0 === s.length) {
                s = tag;
            }else {
                s += ';' + tag;
            }
        });
        eedit_tags_task.value = s;
        if(data.is_complete) {
            eedit_state_task.selectedIndex = 1;
        } else {
            eedit_state_task.selectedIndex = 0;
        }
    })
    .catch(e => {
        sendError(e);
    });
}

if( add_mode ) {
    etitle_h1.textContent = 'Ajout d\'une tâche';
    document.title = 'Ajout d\'une tâche';
} else {
    getTaskData();
}

let editErr;
document.getElementById('edit_task_form').addEventListener('submit', async function(e){
    const txt = eedit_title_task.value;
    e.preventDefault();
      
    if(0 === txt.length) {
        alert('Le titre ne doit pas être vide!');
        return;
    }

    const tags = eedit_tags_task.value.split(';').map( (s) => s.trim()).filter( (s) => 0 !== s.length);

    if(0 === tags.length) {
        alert('Merci de renseigner au moin un Tag!');
        return;
    }

    const bis_completed = (1 === eedit_state_task.selectedIndex) ? true : false;
    let s = add_mode ? '/todos' : ('/todos/' + id);
    editErr = false;

    await doFetch(s, (add_mode ? 'POST' : 'PUT'), {
        text: txt,
        Tags: tags,
        is_complete: bis_completed
    })
    .then( function(response) {
        if(!response.ok) {
            throw('Impossible de récuperer les données');
        }
        getTaskData();
        return response.status;
    } )
    .catch(e => {
        editErr = true;
    });

    if(true === editErr) {
        sendError('La requète n\'a pas aboutie, veuillez réessayer plus tard.');
    } else {
        document.location.assign('tasks.html');
    }
    
});
