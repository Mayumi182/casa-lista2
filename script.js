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
                // Não limpamos o campo de nome aqui, para permitir nova escolha
            });
        } else {
            alert("Este presente não foi escolhido por você!");
        }
    });
}
