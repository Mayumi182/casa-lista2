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

let userName = ''; // Variável para armazenar o nome do usuário

// Função para carregar os presentes do Firebase e exibir na lista
function loadPresents() {
    const presentsList = document.getElementById("present-list");
    presentsList.innerHTML = ''; // Limpa a lista antes de preencher

    // Pega os dados da lista de presentes no Firebase
    database.ref('presents').once('value').then(snapshot => {
        const presents = snapshot.val();

        for (let key in presents) {
            if (presents[key].name) {
                const li = document.createElement('li');
                const isChosen = presents[key].chosenBy;
                
                li.innerHTML = `
                    <span>${presents[key].name}</span>
                    <button onclick="choosePresent('${key}')">Escolher</button>
                    ${isChosen && isChosen === userName ? 
                        `<button onclick="unchoosePresent('${key}')">Desfazer escolha</button>` : 
                        ''} 
                    <div id="chosen-${key}" class="chosen-name"></div>
                `;
                presentsList.appendChild(li);

                // Exibe quem escolheu o presente (se alguém já escolheu)
                const chosenName = document.getElementById(`chosen-${key}`);
                if (presents[key].chosenBy) {
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

    userName = name; // Armazena o nome do usuário

    // Atualiza a escolha no Firebase
    database.ref('presents/' + presentKey).update({
        chosenBy: name
    }).then(() => {
        loadPresents(); // Atualiza a lista de presentes
        nameInput.value = ""; // Limpa o campo de nome, mas mantém o nome em userName
    });
}

// Função para desfazer a escolha de um presente
function unchoosePresent(presentKey) {
    const nameInput = document.getElementById("name");
    const name = userName;

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
            });
        } else {
            alert("Este presente não foi escolhido por você!");
        }
    });
}

// Função para carregar a tela de escolha de presentes
function startChoosing() {
    const nameScreen = document.getElementById('name-screen');
    const presentScreen = document.getElementById('present-screen');
    
    nameScreen.style.display = 'none';  // Esconde a tela de nome
    presentScreen.style.display = 'block';  // Exibe a tela de presentes
    loadPresents(); // Carrega os presentes na tela
}

// Função para voltar à tela inicial (nome)
function goBack() {
    const nameScreen = document.getElementById('name-screen');
    const presentScreen = document.getElementById('present-screen');
    
    nameScreen.style.display = 'block';  // Exibe a tela de nome
    presentScreen.style.display = 'none';  // Esconde a tela de presentes
    document.getElementById("name").value = ''; // Limpa o campo de nome
    userName = ''; // Limpa o nome do usuário para reiniciar
}

// Função para carregar os dados ao carregar a página
window.onload = function() {
    loadPresents();
};
