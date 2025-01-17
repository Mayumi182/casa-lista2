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

// Função para pegar os presentes do Firebase e exibir na lista
function loadPresents() {
    const presentsList = document.getElementById("present-list");
    presentsList.innerHTML = ''; // Limpa a lista antes de preencher

    // Pega os dados da lista de presentes no Firebase
    database.ref('presents').once('value').then(snapshot => {
        const presents = snapshot.val();

        for (let key in presents) {
            if (presents[key].name) {
                const li = document.createElement('li');
                const isChosen = presents[key].chosenBy ? true : false;

                li.innerHTML = `
                    <span>${presents[key].name}</span>
                    ${!isChosen ? `<button onclick="choosePresent('${key}')">Escolher</button>` : ''}
                    ${isChosen ? `<button onclick="unchoosePresent('${key}')">Desfazer escolha</button>` : ''}
                    <div id="chosen-${key}" class="chosen-name"></div>
                `;
                presentsList.appendChild(li);

                // Exibe quem escolheu o presente (se alguém já escolheu)
                const chosenName = document.getElementById(`chosen-${key}`);
                if (isChosen) {
                    chosenName.textContent = `Escolhido por: ${presents[key].chosenBy}`;
                }
            }
        }
    });
}

// Função para escolher um presente
function choosePresent(presentKey) {
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();

    if (name === "") {
        alert("Por favor, insira seu nome.");
        return;
    }

    // Verifica se o presente já foi escolhido
    database.ref('presents/' + presentKey).once('value').then(snapshot => {
        const present = snapshot.val();

        // Se o presente já foi escolhido, não permite a escolha
        if (present.chosenBy) {
            alert("Este presente já foi escolhido por outra pessoa!");
            return;
        }

        // Atualiza a escolha no Firebase
        database.ref('presents/' + presentKey).update({
            chosenBy: name
        }).then(() => {
            loadPresents(); // Atualiza a lista de presentes
            nameInput.value = ""; // Limpa o campo de nome
        });
    });
}

// Função para desfazer a escolha de um presente
function unchoosePresent(presentKey) {
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();

    if (name === "") {
        alert("Por favor, insira seu nome.");
        return;
    }

    // Verifica se o nome corresponde ao que escolheu
    database.ref('presents/' + presentKey).once('value').then(snapshot => {
        const present = snapshot.val();
        if (present.chosenBy === name) {
            // Desfaz a escolha no Firebase
            database.ref('presents/' + presentKey).update({
                chosenBy: null
            }).then(() => {
                loadPresents(); // Atualiza a lista de presentes
                nameInput.value = ""; // Limpa o campo de nome
            });
        } else {
            alert("Este presente não foi escolhido por você!");
        }
    });
}

// Função para carregar os dados ao carregar a página
window.onload = function() {
    loadPresents();
};
