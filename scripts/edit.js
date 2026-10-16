/**
 * 
 * A placer après les éléments de la page
 */
const params = new URLSearchParams(document.location.search);
const add_mode = params.has('add') ? ('true' === params.get('add')) : false;
let id;

if(!add_mode) {
    if(!params.has('id')) {
        gotoIndex();
    }
    id = params.get('id');
    if(Number(id) <= 0) {
        alert('Tâche introuvable, retour à la liste.');
        document.location.assign('tasks.html');
    }
}

const eedit_title_task = document.getElementById('edit_title_task');
const eedit_tags_task = document.getElementById('edit_tags_task');
const eedit_state_task = document.getElementById('edit_state_task');

eedit_state_task.addEventListener('change', () => {
    console.log('@:' + eedit_state_task.selectedIndex);
})

async function getTaskData() {
    try {
        let resp = await doFetch('/todos/' + id);
        if(!resp.ok) {
            throw new Error(`Statut: ${resp.status}`);
        }
        let s = '';
        let data = await resp.json();
        console.log(data);

        eedit_title_task.value = data.text;
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
            //eedit_state_task.dispatchEvent(new Event('change'));
        } else {
            eedit_state_task.selectedIndex = 0;
        }
        document.getElementById('edit_task_del_btn_block').style.display = 'block';
        document.getElementById('edit_task_del_btn').addEventListener('click', async function() {
            if(confirm('Confirmez vous supprimer la tâche' + (data.is_complete ? '?' : ' (attention, non terminée)') )) {
                try {
                    await doFetch('/todos/' + id, 'DELETE');
                }
                catch(e) {
                    sendError('Impossible de supprimer les données');
                }
                document.location.assign('tasks.html');
            }
        });

    }
    catch(e) {
        sendError('Impossible de récuperer les données pour cette tâche.');
    };
}

if( add_mode ) {
    etitle_h1.textContent = 'Ajout d\'une tâche';
    document.title = 'Ajout d\'une tâche';
    document.getElementById('edit_task_del_btn_block').style.display = 'none';
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

    let response = await doFetch(s, (add_mode ? 'POST' : 'PUT'), {
        text: txt,
        Tags: tags,
        is_complete: bis_completed
    });

    if(true !== response.ok) {
        sendError('La requète n\'a pas aboutie, veuillez réessayer plus tard.');
    } else {
        document.location.assign('tasks.html');
    }
});
