//const QUERY_HOSTNAME = 'http://127.0.0.1:3000';
const QUERY_HOSTNAME = 'https://project-zeta-nine-71.vercel.app/:3000';

const user_name = localStorage.getItem('user_name');
let etitle_h1, econtent, eedit_block;

function gotoIndex() {
    window.document.location.assign('index.html');
}

//Logout
function setupLogoutButton() {
    /*document.getElementById('logout').addEventListener('click', (e) => {
        localStorage.removeItem('user_name');
        gotoIndex();
    });*/
}

//Tasks
function displayTasks(econtent) {
    let ntasks = 0;
    let ntasks_done = 0;
    //alert( document.getElementById('progress_back').clientWidth * (ntasks_done / ntasks) + "/" + document.getElementById('progress_back').clientWidth);
    fetch(QUERY_HOSTNAME + '/todos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
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
            let s = '';
            let dte;
            if(todo.is_complete)ntasks_done++;
            
            ebtn.setAttribute('type', 'button');
            ebtn_complete.setAttribute('type', 'button');
            ebtn_handle.setAttribute('type', 'button');
            ebtn_del.setAttribute('type', 'button');

            //Texts
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

            //Classes
            etodo_content_block.classList.add('todo_content_block');
            etodo_block.classList.add('todo_block');
            etodo_fullinf_block.classList.add('todo_fullinf_block_hidden');
            ebtn.classList.add('todo_btn');
            etodo_content.classList.add('todo_content');
            etodo_content.classList.add((todo.is_complete) ? 'todo_content_done' : 'todo_content_todo');
  
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
                await fetch(QUERY_HOSTNAME + '/todos/' + todo.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        is_complete: todo.is_complete
                    })
                })
                .then( function(response) {
                    if(!response.ok) {
                        throw('Impossible de récuperer les données');
                    }
                    return response.status;
                } )
                .catch(e => {
                    alert(e);
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
                if(confirm('Confirmez vous supprimer la tâche?')) {
                    await fetch(QUERY_HOSTNAME + '/todos/' + todo.id, {
                        method: 'DELETE',
                    })
                    .then( function(response) {
                        if(!response.ok) {
                            throw('Impossible de supprimer les données');
                        }
                        return response.status;
                    })
                    .catch(e => {
                        console.error(e);
                    });
                    //etodo_block.style.display = 'none';
                    displayTasks(econtent);
                }
            });
        });
        //document.getElementById('cur_progress').style.width = String(document.getElementById('progress_back').clientWidth * (ntasks_done / ntasks)) + 'px';
        document.getElementById('cur_progress').style.width = ((ntasks_done * 100.0) / ntasks) + '%';
        document.getElementById('progress_text').textContent = 'Taches terminée(s): ' + ntasks_done + '/' + ntasks;
    })
    .catch(e => {
        console.error(e);
    });
}

let myChart;
let chartCtx;

function displayTasksStats() {
    //alert( document.getElementById('progress_back').clientWidth * (ntasks_done / ntasks) + "/" + document.getElementById('progress_back').clientWidth);
    fetch(QUERY_HOSTNAME + '/todos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( function(response) {
        if(!response.ok) {
            throw('Impossible de récuperer les données');
        }
        return response.json();
    } )
    .then(data => {
        const ntasks = data[0].todolist.length;
        //console.log( data[0].todolist.filter((todo) => (true === todo.is_complete)) );
        const ntasks_done = data[0].todolist.filter((todo) => (true === todo.is_complete)).length;

        data[0].todolist.forEach(todo => {
            //document.getElementById('cur_progress').style.width = String(document.getElementById('progress_back').clientWidth * (ntasks_done / ntasks)) + 'px';
            document.getElementById('cur_progress').style.width = ((ntasks_done * 100.0) / ntasks) + '%';
            document.getElementById('progress_text').textContent = 'Taches terminée(s): ' + ntasks_done + '/' + ntasks;
        });

        
        if(null !== chartCtx) {//script utilisé sur tasks et sur stats mais seul stats a le chart
            //console.log( myChart.data.datasets[0].data);
            let ntodo = ntasks - ntasks_done;
            if(myChart.data.datasets[0].data[0] !== ntodo || myChart.data.datasets[0].data[0] !== ntasks_done) {
                myChart.data.datasets[0].data = [ntodo, ntasks_done];
                myChart.update();
            }
        }


    })
    .catch(e => {
        console.error(e);
    });
}
setInterval(displayTasksStats, 500);

