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

let name = "";

// Função para carregar a lista de presentes
function loadPresents() {
    const presentsList = document.getElementById("present-list");
    presentsList.innerHTML = ''; // Limpa a lista antes de preencher

    // Pega os dados da lista de presentes no Firebase
    database.ref('presents').once('value').then(snapshot => {
        const presents = snapshot.val();

        for (let key in presents) {
            if (presents[key].name) {
                const li = document.createElement('li');
                const button = document.createElement('button');
                button.innerHTML = 'Escolher';
                
                // Desabilitar o botão se o presente já foi escolhido
                if (presents[key].chosenBy) {
                    button.disabled = true;
                    button.innerHTML = 'Escolhido';
                } else {
                    button.onclick = function() {
                        choosePresent(key);
                    };
                }
                
                const unchooseButton = document.createElement('button');
                unchooseButton.innerHTML = 'Desfazer escolha';
                unchooseButton.style.display = (presents[key].chosenBy === name) ? 'inline-block' : 'none'; // Exibir o botão de desfazer escolha apenas se o nome for o mesmo

                unchooseButton.onclick = function() {
                    unchoosePresent(key);
                };

                const chosenName = document.createElement('div');
                chosenName.classList.add('chosen-name');
                chosenName.textContent = presents[key].chosenBy ? `Escolhido por: ${presents[key].chosenBy}` : '';

                li.appendChild(document.createElement('span')).innerHTML = presents[key].name;
                li.appendChild(button);
                li.appendChild(unchooseButton);
                li.appendChild(chosenName);
                presentsList.appendChild(li);
            }
        }
    });
}

// Função para escolher um presente
function choosePresent(presentKey) {
    if (name === "") {
        alert("Por favor, insira seu nome.");
        return;
    }

    // Atualiza a escolha no Firebase
    database.ref('presents/' + presentKey).update({
        chosenBy: name
    }).then(() => {
        loadPresents(); // Atualiza a lista de presentes
    });
}

// Função para desfazer a escolha de um presente
function unchoosePresent(presentKey) {
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

// Função para iniciar a escolha, após preencher o nome
function startChoosing() {
    name = document.getElementById("name").value.trim();

    if (name === "") {
        alert("Por favor, insira seu nome.");
        return;
    }

    // Esconde a tela de nome e mostra a tela de presentes
    document.getElementById("name-screen").style.display = "none";
    document.getElementById("present-screen").style.display = "block";

    loadPresents(); // Carrega os presentes
}

// Função para voltar para a tela inicial
function goBack() {
    document.getElementById("name-screen").style.display = "block";
    document.getElementById("present-screen").style.display = "none";

    // Limpa o nome, caso o usuário queira mudar
    name = "";
    document.getElementById("name").value = "";
}
