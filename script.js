if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users"));
}

function signup() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (!username || !password) return alert("Fill all fields");

    let users = getUsers();

    if (users.find(u => u.username === username)) {
        return alert("User already exists");
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Now login.");
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let users = getUsers();

    let valid = users.find(u => u.username === username && u.password === password);

    if (valid) {
        localStorage.setItem("loggedIn", username);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("error").innerText = "Invalid Credentials";
    }
}

function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}

if (window.location.pathname.includes("dashboard.html")) {
    if (!localStorage.getItem("loggedIn")) {
        window.location.href = "index.html";
    }
}

let vmList = [];
let totalStorage = 0;

function createVM() {
    let name = document.getElementById("vmName").value;
    let cpu = parseInt(document.getElementById("cpu").value);
    let ram = parseInt(document.getElementById("ram").value);
    let os = document.getElementById("os").value;

    if (!name) return alert("Enter VM Name");

    vmList.push({ name, cpu, ram, os });
    renderVMs();
    calculateBilling();
}

function renderVMs() {
    let table = document.getElementById("vmTable");
    table.innerHTML = "";

    vmList.forEach((vm, index) => {
        table.innerHTML += `
        <tr>
            <td>${index+1}</td>
            <td>${vm.name}</td>
            <td>${vm.cpu}</td>
            <td>${vm.ram} GB</td>
            <td>${vm.os}</td>
            <td><button onclick="deleteVM(${index})">X</button></td>
        </tr>
        `;
    });
}

function deleteVM(index) {
    vmList.splice(index, 1);
    renderVMs();
    calculateBilling();
}

function allocateStorage() {
    let size = parseInt(document.getElementById("storageSize").value);
    if (!size) return;

    totalStorage += size;
    calculateBilling();
}

function calculateBilling() {
    let cpuCost = vmList.reduce((sum, vm) => sum + (vm.cpu * 100), 0);
    let ramCost = vmList.reduce((sum, vm) => sum + (vm.ram * 50), 0);
    let storageCost = totalStorage * 5;

    let total = cpuCost + ramCost + storageCost;

    document.getElementById("billingDetails").innerHTML =
        `CPU Cost: ₹${cpuCost}<br>
         RAM Cost: ₹${ramCost}<br>
         Storage Cost: ₹${storageCost}<br>
         <hr>
         <strong>Total Bill: ₹${total}</strong>`;
}