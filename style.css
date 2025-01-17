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

// Função para começar a escolher (primeiro esconder a tela de nome e mostrar a lista de presentes)
function startChoosing() {
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();

    if (name === "") {
        alert("Por favor, insira seu nome.");
        return;
    }

    // Esconde a tela de nome
    document.getElementById("name-screen").style.display = "none";
    // Exibe a tela de escolha de presentes
    document.getElementById("choose-screen").style.display = "block";
    
    // Armazena o nome do usuário no localStorage para usar nas funções de escolha e desfazer
    localStorage.setItem("userName", name);

    loadPresents(); // Carrega a lista de presentes
}

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
                li.innerHTML = `
                    <span>${presents[key].name}</span>
                    <button onclick="choosePresent('${key}')">Escolher</button>
                    <button onclick="unchoosePresent('${key}')">Desfazer escolha</button>
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
    const name = localStorage.getItem("userName");

    if (!name) {
        alert("Por favor, insira seu nome.");
        return;
    }

    // Verifica se o presente já foi escolhido
    database.ref('presents/' + presentKey).once('value').then(snapshot => {
        const present = snapshot.val();
        if (present.chosenBy) {
            alert("Este presente já foi escolhido.");
            return;
        }

        // Atualiza a escolha no Firebase
        database.ref('presents/' + presentKey).update({
            chosenBy: name
        }).then(() => {
            loadPresents(); // Atualiza a lista de presentes
        });
    });
}

// Função para desfazer a escolha de um presente
function unchoosePresent(presentKey) {
    const name = localStorage.getItem("userName");

    if (!name) {
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

// Função para carregar os dados ao carregar a página
window.onload = function() {
    if (!localStorage.getItem("userName")) {
        document.getElementById("name-screen").style.display = "block";
        document.getElementById("choose-screen").style.display = "none";
    } else {
        document.getElementById("name-screen").style.display = "none";
        document.getElementById("choose-screen").style.display = "block";
        loadPresents();
    }
};
