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


// Função para exibir a data e hora atual
function updateCurrentDateTime() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const formattedTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('currentDateTime').innerHTML = `<div>${formattedDate}</div><div>${formattedTime}</div>`;
}

// Chama a função para atualizar a data e hora imediatamente
updateCurrentDateTime();

// Atualiza a data e hora a cada segundo
setInterval(updateCurrentDateTime, 1000);


// Funções de utilidade para LocalStorage
function loadFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Função para atualizar a data e hora atuais
function updateDateTime() {
    const currentDateTimeElement = document.getElementById("currentDateTime");
    const now = new Date();
    currentDateTimeElement.textContent = `Data e Hora Atual: ${now.toLocaleString('pt-BR')}`;
}

// Funções CRUD de Regimes
function initializeRegimes() {
    const regimeForm = document.getElementById("regimeForm");
    const regimeList = document.getElementById("regimeList");

    regimeForm.addEventListener("submit", event => {
        event.preventDefault();
        const regime = {
            name: document.getElementById("regimeName").value,
            workHours: document.getElementById("workHours").value,
            lunchHours: document.getElementById("lunchHours").value,
        };
        const regimes = loadFromLocalStorage("regimes");
        regimes.push(regime);
        saveToLocalStorage("regimes", regimes);
        renderRegimes();
        regimeForm.reset();
    });

    function renderRegimes() {
        regimeList.innerHTML = "";
        const regimes = loadFromLocalStorage("regimes");
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

    renderRegimes();
}

// Funções CRUD de Usuários
function initializeUsers() {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");
    const userRegime = document.getElementById("userRegime");

    const regimes = loadFromLocalStorage("regimes");
    regimes.forEach(regime => {
        const option = document.createElement("option");
        option.value = regime.name;
        option.textContent = regime.name;
        userRegime.appendChild(option);
    });

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
}

// Funções para Registro de Pontos
function initializePoints() {
    const pointForm = document.getElementById("pointForm");
    const pointList = document.getElementById("pointList");

    pointForm.addEventListener("submit", event => {
        event.preventDefault();

        const point = {
            cpf: document.getElementById("cpfPoint").value,
            date: document.getElementById("datePoint").value,
            entryTime: document.getElementById("entryTime").value,
            exitTime: document.getElementById("exitTime").value,
            breakStart: document.getElementById("breakStart").value,
            breakEnd: document.getElementById("breakEnd").value,
            justification: document.getElementById("pointJustification").value,
        };

        const users = loadFromLocalStorage("users");
        const userExists = users.some(user => user.cpf === point.cpf);
        
        if (userExists) {
            const points = loadFromLocalStorage("points");
            points.push(point);
            saveToLocalStorage("points", points);
            renderPoints();
            pointForm.reset();
            alert("Ponto registrado com sucesso!");
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
            listItem.textContent = `CPF: ${point.cpf}, Data: ${point.date}, Entrada: ${point.entryTime}, Saída: ${point.exitTime}, Intervalo: ${point.breakStart} - ${point.breakEnd}, Justificativa: ${point.justification}`;
            pointList.appendChild(listItem);
        });
    }

    renderPoints();
}

// Função para excluir usuário
function deleteUser(index) {
    const users = loadFromLocalStorage("users");
    users.splice(index, 1);
    saveToLocalStorage("users", users);
    renderUsers();
    alert("Usuário excluído com sucesso.");
}

// Inicializa todas as funções necessárias ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    updateDateTime(); // Atualiza a data e hora ao carregar a página
});
