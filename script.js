// Função para carregar conteúdo dinamicamente
function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.getElementById("content").innerHTML = html;
            if (page === "regimes.html") initializeRegimes();
            if (page === "usuarios.html") initializeUsers();
            if (page === "pontos.html") initializePoints();
        });
}

// Funções de utilidade para LocalStorage
function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Funções CRUD de Regimes
function initializeRegimes() {
    const regimeForm = document.getElementById("regimeForm");
    const regimeList = document.getElementById("regimeList");

    regimeForm.addEventListener("submit", event => {
        event.preventDefault();
        
        // Captura os dados do formulário
        const regime = {
            name: document.getElementById("regimeName").value,
            workHours: document.getElementById("workHours").value,
            lunchHours: document.getElementById("lunchHours").value,
        };
        
        // Salva no LocalStorage
        const regimes = loadFromLocalStorage("regimes");
        regimes.push(regime);
        saveToLocalStorage("regimes", regimes);

        renderRegimes();
        regimeForm.reset();
    });

    function renderRegimes() {
        regimeList.innerHTML = "";
        const regimes = loadFromLocalStorage("regimes");
        
        // Renderiza cada regime
        regimes.forEach((regime, index) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.innerHTML = `
                ${regime.name} - Trabalho: ${regime.workHours}h, Almoço: ${regime.lunchHours}h
                <button class="btn btn-danger btn-sm" onclick="deleteRegime(${index})">Excluir</button>
            `;
            regimeList.appendChild(listItem);
        });
    }

    function deleteRegime(index) {
        const regimes = loadFromLocalStorage("regimes");
        regimes.splice(index, 1);
        saveToLocalStorage("regimes", regimes);
        renderRegimes();
    }

    renderRegimes();
}


// Funções CRUD de Usuários
function initializeUsers() {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");
    const userRegime = document.getElementById("userRegime");

    // Carrega regimes no dropdown
    const regimes = loadFromLocalStorage("regimes");
    regimes.forEach(regime => {
        const option = document.createElement("option");
        option.value = regime.name; // Modificado para usar o nome do regime
        option.textContent = regime.name; // Modificado para usar o nome do regime
        userRegime.appendChild(option);
    });
}
    userForm.addEventListener("submit", event => {
        event.preventDefault();
        const user = {
            cpf: document.getElementById("userCpf").value,
            nome: document.getElementById("userName").value,
            dob: document.getElementById("userDob").value,
            regime: document.getElementById("userRegime").value,
        };
        const users = loadFromLocalStorage("users");
        users.push(user);
        saveToLocalStorage("users", users);
        renderUsers();
        userForm.reset();
    });

    function renderUsers() {
        userList.innerHTML = "";
        const users = loadFromLocalStorage("users");
        users.forEach((user, index) => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.innerHTML = `${user.nome} - ${user.cpf} - ${user.regime} <button class="btn btn-danger btn-sm" onclick="deleteUser(${index})">Excluir</button>`;
            userList.appendChild(listItem);
        });
    }

    function deleteUser(index) {
        // Exibir alerta antes de excluir
        alert("Não é possível excluir o ponto.");
        
        // Se você realmente deseja que a exclusão ocorra, mantenha as linhas abaixo
        const users = loadFromLocalStorage("users");
        users.splice(index, 1);
        saveToLocalStorage("users", users);
        renderUsers();
    }
    

// Funções para Registro de Pontos
function initializePoints() {
    const pointForm = document.getElementById("pointForm");
    const pointList = document.getElementById("pointList");

    pointForm.addEventListener("submit", event => {
        event.preventDefault();
        const point = {
            cpf: document.getElementById("cpfPoint").value,
            dob: document.getElementById("dobPoint").value,
            date: document.getElementById("datePoint").value,
            time: document.getElementById("timePoint").value,
            justification: document.getElementById("pointJustification").value,
            file: document.getElementById("fileUpload").files[0] // Adicionando o arquivo
        };

        const users = loadFromLocalStorage("users");
        const userExists = users.some(user => user.cpf === point.cpf && user.dob === point.dob);
        
        if (userExists) {
            const points = loadFromLocalStorage("points");
            points.push(point);
            saveToLocalStorage("points", points);
            renderPoints();
            pointForm.reset();
        } else {
            alert("Usuário não encontrado!");
        }
    });

    function renderPoints() {
        pointList.innerHTML = "";
        const points = loadFromLocalStorage("points");
        points.forEach(point => {
            const listItem = document.createElement("li");
            listItem.className = "list-group-item";
            listItem.textContent = `${point.cpf} - ${point.date} ${point.time} - ${point.justification}`;
            pointList.appendChild(listItem);
        });
    }

    renderPoints();
}

//Puxa a localização do usuário
navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
});

// Exibe uma mensagem de alerta informando que o ponto foi registrado
divAlerta.classList.remove("hidden");
divAlerta.classList.add("show");

const AlertaTexto = document.getElementById("alerta-texto");
AlertaTexto.textContent = "Ponto Registrado como: " + tipoPonto + " " + hora;

// Oculta a mensagem de alerta após 5 segundos
setTimeout(() => {
    divAlerta.classList.remove("show");
    divAlerta.classList.add("hidden");
}, 5000);