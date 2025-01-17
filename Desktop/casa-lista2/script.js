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

// Inicialize o Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Lista de presentes
const presents = [
    { id: 1, name: 'Jogo de Panelas' },
    { id: 2, name: 'Micro-ondas' },
    { id: 3, name: 'Aspirador de pó' },
    { id: 4, name: 'Toalhas de Banho' }
];

// Função para renderizar a lista de presentes
function renderPresentList() {
    const listContainer = document.getElementById('present-list');
    listContainer.innerHTML = '';  // Limpa a lista antes de renderizar novamente

    presents.forEach(present => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${present.name}</span>
            <button id="btn-${present.id}" onclick="choosePresent(${present.id})" ${isChosen(present.id) ? 'disabled' : ''}>Escolher</button>
        `;
        listContainer.appendChild(li);
    });
}

// Verifica se o presente já foi escolhido
function isChosen(presentId) {
    const presentRef = database.ref('presents/' + presentId);
    presentRef.once('value', snapshot => {
        return snapshot.exists();
    });
}

// Função para marcar o presente como escolhido
function choosePresent(presentId) {
    const name = document.getElementById('name').value;
    if (!name) {
        alert("Por favor, insira seu nome!");
        return;
    }

    const presentRef = database.ref('presents/' + presentId);
    presentRef.set({
        name: name
    }).then(() => {
        renderPresentList();
    });
}

// Função para confirmar escolha e salvar no Firebase
function submitChoice() {
    const name = document.getElementById('name').value;
    if (!name) {
        alert("Por favor, insira seu nome!");
        return;
    }

    alert("Presente confirmado! Obrigado!");
}

// Inicializar a página com a lista de presentes
renderPresentList();
