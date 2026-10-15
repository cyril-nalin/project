//const QUERY_HOSTNAME = 'http://127.0.0.1:3000';
const QUERY_HOSTNAME = 'https://totolist-iota.vercel.app';
const STATS_REFRESH_INTERVAL = 500;


const user_name = localStorage.getItem('user_name');
const err_box = document.getElementById('err_box');
const etitle_h1 = document.getElementById('main_title');
const econtent = document.getElementById('subcontent');
const eedit_block = document.getElementById('edit_block');

let has_err = false;
let myChart = null;
let chartCtx = null;
let callbackID = null;

function gotoIndex() {
    window.document.location.assign('index.html');
}

if(null === user_name) {
    gotoIndex();
}

function sendError(msg) {
    if(null !== err_box) {
        if(false === has_err) {
            err_box.textContent = msg;
            has_err = true;
        }
    }
    console.error(msg);
}

function clearError(msg) {
    has_err = false;
    if(null !== err_box) {
        err_box.textContent = '';
    }
}

function doFetch(path, meth = 'GET', data = null) {
    //clearError();
    return (null !== data) ?
        fetch(QUERY_HOSTNAME + path, {
            method: meth,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }) :
        fetch(QUERY_HOSTNAME + path, {
            method: meth,
            headers: {'Access-Control-Allow-Origin': '*'}
        });
}

//Tasks
function displayTasks() {
    let ntasks = 0;
    let ntasks_done = 0;

    doFetch('/todos')
    .then( function(response) {
        if(!response.ok) {
            throw('Impossible de récuperer les données');
        }
        return response.json();
    } )
    .then(data => {
        econtent.innerHTML = '';
        ntasks += data[0].todolist.length;
        data[0].todolist.forEach(todo => {
            const etodo_content_block = document.createElement('div');
            const etodo_block = document.createElement('div');
            const etodo_fullinf_block = document.createElement('div');
            const etodo_bottom_block = document.createElement('div');
            const ebtn = document.createElement('input');
            const ebtn_complete = document.createElement('input');
            const ebtn_handle = document.createElement('input');
            const ebtn_del = document.createElement('input');
            const etodo_content = document.createElement('p');
            const etodo_tags = document.createElement('p');
            const etodo_date = document.createElement('p');
            const etodo_state = document.createElement('p');
            const ehidden_id = document.createElement('input');
            let s = '';
            let dte;
            if(todo.is_complete)ntasks_done++;
            
            ebtn.setAttribute('type', 'button');
            ebtn_complete.setAttribute('type', 'button');
            ebtn_handle.setAttribute('type', 'button');
            ebtn_del.setAttribute('type', 'button');
            ehidden_id.setAttribute('type', 'hidden');

            //Texts/values
            ebtn.value = '+';
            ebtn_handle.value = "Modifier";
            ebtn_complete.value = 'Changer état';
            ebtn_del.value = "Supprimer";
            etodo_content.textContent = todo.text;
            dte = new Date(todo.created_at);
            etodo_date.textContent = dte.toLocaleString();
            etodo_state.textContent  = todo.is_complete ? 'Terminée' : 'A faire';
            todo.Tags.forEach(tag => {
                if(0 === s.length) s = tag;
                else s += ';' + tag;
            });
            etodo_tags.textContent = s;
            ehidden_id.value = todo.id;

            //Classes
            etodo_content_block.classList.add('todo_content_block');
            etodo_block.classList.add('todo_block');
            etodo_fullinf_block.classList.add('todo_fullinf_block_hidden');
            ebtn.classList.add('todo_btn');
            etodo_content.classList.add('todo_content');
            etodo_content.classList.add(todo.is_complete ? 'todo_content_done' : 'todo_content_todo');
  
            etodo_tags.classList.add('todo_tags');
            etodo_date.classList.add('todo_date');
            etodo_state.classList.add('todo_state');
            etodo_bottom_block.classList.add('todo_bottom_block');
            
            //on imbrique le tout
            etodo_content_block.appendChild(ebtn);
            etodo_content_block.appendChild(etodo_content);
            
            etodo_fullinf_block.appendChild(etodo_tags);
            etodo_fullinf_block.appendChild(etodo_date);
            etodo_fullinf_block.appendChild(etodo_state);
            etodo_fullinf_block.appendChild(ehidden_id);
            
            etodo_bottom_block.appendChild(ebtn_handle);
            etodo_bottom_block.appendChild(ebtn_complete);
            etodo_bottom_block.appendChild(ebtn_del);
            
            etodo_block.appendChild(etodo_content_block);
            etodo_block.appendChild(etodo_fullinf_block);
            etodo_block.appendChild(etodo_bottom_block);

            econtent.appendChild(etodo_block);

            //Gestion des boutons
            ebtn.addEventListener('click', function() {
                switch(ebtn.value) {
                    case '+':
                        etodo_fullinf_block.classList.remove('todo_fullinf_block_hidden');
                        etodo_fullinf_block.classList.add('todo_fullinf_block');
                        ebtn.value = '-';
                        break;

                    default:
                        etodo_fullinf_block.classList.remove('todo_fullinf_block');
                        etodo_fullinf_block.classList.add('todo_fullinf_block_hidden');
                        ebtn.value = '+';
                        break;
                }
            });
            ebtn_handle.addEventListener('click', function() {
                window.document.location.assign('edit.html?id=' + todo.id);
            });
            ebtn_complete.addEventListener('click', async function() {
                todo.is_complete = !todo.is_complete;
                await doFetch('/todos/' + todo.id, 'PUT', {is_complete: todo.is_complete})
                .then( function(response) {
                    if(!response.ok) {
                        throw('Impossible de récuperer les données');
                    }
                    return response.status;
                } )
                .catch(e => {
                    sendError(e);
                });
                /*if(todo.is_complete) {
                    ntasks_done++;
                    etodo_content.classList.remove('todo_content_todo');
                    etodo_content.classList.add('todo_content_done');
                    etodo_state.textContent  = 'Terminée';
                } else {
                    ntasks_done--;
                    etodo_content.classList.remove('todo_content_done');
                    etodo_content.classList.add('todo_content_todo');
                    etodo_state.textContent  = 'A faire';
                }*/
                displayTasks(econtent);
            });

            ebtn_del.addEventListener('click', async function() {
                if(confirm('Confirmez vous supprimer la tâche' + (todo.is_complete ? '?' : ' (attention, non terminée)') )) {
                    await doFetch('/todos/' + todo.id, 'DELETE')
                    .then( function(response) {
                        if(!response.ok) {
                            throw('Impossible de supprimer les données');
                        }
                        return response.status;
                    })
                    .catch(e => {
                        sendError(e);
                    });
                    //etodo_block.style.display = 'none';
                    displayTasks(econtent);
                }
            });
        });
        document.getElementById('cur_progress').style.width = ((ntasks_done * 100.0) / ntasks) + '%';
        document.getElementById('progress_text').textContent = 'Taches terminée(s): ' + ntasks_done + '/' + ntasks;
    })
    .catch(e => {
        console.error(e);
    });
}

function displayTasksStats() {
    doFetch('/todos')
    .then( function(response) {
        if(!response.ok) {
            throw('Impossible de récuperer les données');
        }
        return response.json();
    } )
    .then(data => {
        const ntasks = data[0].todolist.length;
        const ntasks_done = data[0].todolist.filter((todo) => (true === todo.is_complete)).length;

        data[0].todolist.forEach(todo => {
            document.getElementById('cur_progress').style.width = ((ntasks_done * 100.0) / ntasks) + '%';
            document.getElementById('progress_text').textContent = 'Taches terminée(s): ' + ntasks_done + '/' + ntasks;
        });
        
        if(null !== chartCtx) {//script utilisé sur tasks et sur stats mais seul stats a le chart
            let ntodo = ntasks - ntasks_done;
            if(myChart.data.datasets[0].data[0] !== ntodo || myChart.data.datasets[0].data[0] !== ntasks_done) {
                myChart.data.datasets[0].data = [ntodo, ntasks_done];
                myChart.update();
            }
        }
    })
    .catch(e => {
        if(null !== callbackID) clearInterval(callbackID);
        sendError('Impossible de récuperer les données, veuillez rafraichir la page ou revenir plus tard.');
    });
}

