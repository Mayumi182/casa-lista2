// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDKXT7xVBuv-56IXKuUaah8-2aXp5MKY90",
    authDomain: "cha-casa-pandas-9913b.firebaseapp.com",
    databaseURL: "https://cha-casa-pandas-9913b-default-rtdb.firebaseio.com",
    projectId: "cha-casa-pandas-9913b",
    storageBucket: "cha-casa-pandas-9913b.firebasestorage.app",
    messagingSenderId: "878950006907",
    appId: "1:878950006907:web:62eb9256722a0bb77be2de"
};

// Inicializando o Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Referência para a lista de presentes no Firebase
const presentsRef = database.ref('presents');

// Função para exibir a lista de presentes
function loadPresents() {
    presentsRef.on('value', (snapshot) => {
        const presents = snapshot.val();
        
        // Verificando se os dados foram carregados
        console.log("Dados carregados do Firebase:", presents);

        if (presents) {
            const presentList = document.getElementById('present-list');
            presentList.innerHTML = ''; // Limpar a lista antes de adicionar os itens

            // Adicionando os presentes na lista
            for (let id in presents) {
                const present = presents[id];
                const li = document.createElement('li');
                li.classList.add('present-item');
                li.innerHTML = `
                    <label>
                        <input type="checkbox" class="present-checkbox" data-id="${id}">
                        ${present.name}
                    </label>
                    <span id="chosen-by-${id}">${present.chosenBy ? `Escolhido por: ${present.chosenBy}` : ''}</span>
                `;
                presentList.appendChild(li);
            }
        } else {
            console.log("Nenhum presente encontrado.");
        }
    });
}

// Função para enviar a escolha do presente
function submitChoice() {
    const name = document.getElementById('name').value;
    const checkedPresent = document.querySelector('.present-checkbox:checked');

    if (name && checkedPresent) {
        const presentId = checkedPresent.getAttribute('data-id');
        const chosenBySpan = document.getElementById(`chosen-by-${presentId}`);
        const presentRef = database.ref('presents/' + presentId);

        // Atualizando o presente com o nome do escolhido
        presentRef.update({ chosenBy: name });

        // Atualizando a interface
        chosenBySpan.innerText = `Escolhido por: ${name}`;
        document.getElementById('name').value = ''; // Limpar o campo de nome
    } else {
        alert('Por favor, escolha um presente e adicione seu nome.');
    }
}

// Carregar a lista de presentes ao carregar a página
loadPresents();
