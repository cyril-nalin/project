/**
 * 
 * A placer après les éléments de la page
 */
//const etitle_h1 = document.getElementById('main_title');
econtent = document.getElementById('content');

if(null === user_name) {
    gotoIndex();
}

const params = new URLSearchParams(document.location.search);
if(!params.has('id')) {//ne devrait pas arriver a moin qu'on ne change manuellement l'url
    gotoIndex();
}
const id = params.get('id');

setupLogoutButton();

const eedit_title_task = document.getElementById('edit_title_task');
const eedit_tags_task = document.getElementById('edit_tags_task');
const eedit_state_task = document.getElementById('edit_state_task');

function getTaskData() {
    fetch(QUERY_HOSTNAME + '/todos/' + id)
    .then( function(response) {
        if(!response.ok) {
            throw('Impossible de récuperer les données');
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
        console.error(e);
        gotoIndex();
    });
}

getTaskData();

document.getElementById('edit_task_form').addEventListener('submit', function(e){
    e.preventDefault();
    const txt = eedit_title_task.value;

    if(0 === txt.length) {
        alert('Le titre ne doit pas être vide!');
    }

    const tags = eedit_tags_task.value.split(';');
    if(0 === tags.length) {
        alert('Merci de renseigner au moin un Tag!');
    }

    const bis_completed = (1 === eedit_state_task.selectedIndex) ? true : false;

    fetch(QUERY_HOSTNAME + '/todos/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: txt,
            Tags: tags,
            is_complete: bis_completed
        })
    })
    .then( function(response) {
        if(!response.ok) {
            throw('Impossible de récuperer les données');
        }
        getTaskData();
        return response.status;
    } )
    .catch(e => {
        alert(e);
    });
    document.location.assign('tasks.html');
});
