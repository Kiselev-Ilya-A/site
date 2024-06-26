/* eslint-disable no-use-before-define */
/* eslint-disable max-len */

function showAlert(msg, category = 'success') {
    // метод получения объекта, соответствующий элементу веб-страницы
    let alerts = document.querySelector('.alerts');
    // Шаблон уведомления
    let template = document.getElementById('alert-template');
    //клонирует 
    let newAlert = template.content.firstElementChild.cloneNode(true);
    newAlert.querySelector('.msg').innerHTML = msg;
    //Добавление уведомлений
    alerts.append(newAlert);
    if (category == 'error') {
        newAlert.classList.add('alert-danger');
    } else {
        newAlert.classList.add('alert-success');
    }

    if (category == 'success') {
        setTimeout(() => {
            newAlert.remove();
        }, 5000);
    }
}

function alertActionHandler(event) {
    let rowGuide = event.target.parentNode.parentNode;
    rowGuide.className = "table-warning";
    let alertMessage = "Заявка успешно создана";
    showAlert(alertMessage, 'success');
}

let api_key = "70ab2823-fd8e-4de9-825a-3fe4f0790b9f";

let allRoutes;
let filteredRoutes;
let currentPageRoutes = 0;
const rowsPerPageRoutes = 3;

let totalCountRoutes = 0;

function getRoutes() {
    const url = `http://edu.std-900.ist.mospolytech.ru/api/routes?api_key=${api_key}`;

    //Создание нового запроса
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";

    xhr.onload = function () {
        if (xhr.status === 200) {
            allRoutes = this.response; //Обновление статуса по строкам через запрос
            filteredRoutes = allRoutes;
            totalCountRoutes = allRoutes.length;
            updatePagination(1);
            displayRoutesTable();
            displayObjectSelector();
        } else {
            showAlert(`Ошибка на сервере!`, 'error');
        }
    };
    xhr.send();
}

function choiceButtonClick(event) {
    let guideRows = document.getElementById("routes-list").children;
    for (let i = 0; i < guideRows.length; i++) {
        guideRows[i].className = "";
    }

    let rowGuide = event.target.parentNode.parentNode;
    rowGuide.className = "table-warning";
    let routeId = event.target.getAttribute("route-id");
    const url = `http://edu.std-900.ist.mospolytech.ru/api/routes/${routeId}/guides?api_key=${api_key}`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "json";

    xhr.onload = function () {
        if (xhr.status === 200) {
            allGuides = this.response;
            filteredGuides = allGuides;
            totalGuidesCount = allGuides.length;
            displayGuidesTable();
            displayLanguagesSelect();
        } else {
            alert("Ошибка!" + this.response.error);
        }

    };

    xhr.send();
}

function createOption(content) {
    const option = document.createElement('option');
    option.value = content;
    option.text = content;
    return option;
}

function displayRoutesTable() {
    let tbody = document.getElementById("routes-list");
    tbody.innerHTML = "";

    for (let i = (currentPageRoutes - 1) * rowsPerPageRoutes; i < currentPageRoutes * rowsPerPageRoutes; i++) {
        if (i < totalCountRoutes) {
            if (filteredRoutes[i] !== undefined) {
                let row = tbody.insertRow();
                let name = row.insertCell(0);
                name.innerText = filteredRoutes[i].name.toString();
                let discr = row.insertCell(1);
                discr.innerText = filteredRoutes[i].description.toString();
                let objects = row.insertCell(2);
                objects.innerText = filteredRoutes[i].mainObject.toString();
                let buttons = row.insertCell(3);
                let button = document.createElement("button");

                button.type = "button";
                button.className = "btn btn-warning";
                button.textContent = "Оформить";
                button.setAttribute("route-id", filteredRoutes[i].id);
                button.addEventListener("click", choiceButtonClick);
                buttons.appendChild(button);
            }
        }
    }
}

function getUniqueObjects() {
    const uniqueObjects = new Set();
    const re = new RegExp("/(\\s-\\s)|(\\s–\\s)|(\\s-\\s)|(\\s-\\s)/");
    for (let i = 0; i < allRoutes.length; i++) {
        let objects = allRoutes[i].mainObject.toString().split(re);
        for (let j = 0; j < objects.length; j++) {
            if (objects[j] !== undefined && objects[j].length > 4 && objects[j].length < 25) {
                uniqueObjects.add(objects[j]);
            }
        }
    }
    return uniqueObjects;
}

function routeSearchFilter() {
    let searchedName = document.getElementById("searchName").value;
    routeObjectFilter();
    filteredRoutes = filteredRoutes.filter(route => {
        return route.name.toString().includes(searchedName);
    });
    currentPageRoutes = 1;
    updatePagination(1);
    displayRoutesTable();
}

function displayObjectSelector() {
    let selector = document.getElementById("selectObject");
    //Очистка памяти через innetHTML
    selector.innerHTML = '';
    selector.appendChild(createOption("Не выбрано"));
    let uniqueObjects = getUniqueObjects();
    uniqueObjects.forEach(name => {
        selector.appendChild(createOption(name));
    });
}

function routeObjectFilter() {
    let selector = document.getElementById("selectObject");
    let selectedOption = selector.options[selector.selectedIndex];

    currentPageRoutes = 1;
    if (selectedOption.value === "Не выбрано") {
        filteredRoutes = allRoutes;
    } else {
        filteredRoutes = allRoutes.filter(route => {
            return route.mainObject.toString().includes(selectedOption.value);
        });
    }
    updatePagination(1);
    displayRoutesTable();
}

let allGuides;
let filteredGuides;
let currentPageGuides = 0;
const rowsPerPageGuides = 5;

let totalGuidesCount = 0;

function displayGuidesTable() {
    let tbody = document.getElementById("guidesBody");
    let totalCountGuides = filteredGuides.length;
    tbody.innerHTML = "";
  
    for (let i = (currentPageGuides - 1) * rowsPerPageGuides; i < currentPageGuides * rowsPerPageGuides; i++) {
        if (i < totalCountGuides) {
            if (filteredGuides[i] !== undefined) {
                let row = tbody.insertRow();
                let photo = row.insertCell(0);
                photo.innerHTML = '<img src="img/avatar.png" alt="profile_photo" style="width: 115px; height: 75px;">';
                let name = row.insertCell(1);
                name.innerText = filteredGuides[i].name.toString();
                let language = row.insertCell(2);
                language.innerText = filteredGuides[i].language.toString();
                let workExperience = row.insertCell(3);
                workExperience.innerText = filteredGuides[i].workExperience.toString();
                let pricePerHour = row.insertCell(4);
                pricePerHour.innerText = filteredGuides[i].pricePerHour.toString();
                let cellButton = row.insertCell(5);
                let button = document.createElement("button");

                button.type = "button";
                button.className = "btn btn-warning";
                button.textContent = "Выбрать";
                button.setAttribute("guide-id", filteredGuides[i].id);
                button.addEventListener("click", alertActionHandler);
                cellButton.appendChild(button);
            }
        }
    }
}


function getUniqueLanguages() {
    const uniqueLanguages = new Set();
    for (let i = 0; i < allGuides.length; i++) {
        uniqueLanguages.add(allGuides[i].language.toString());
    }
    return uniqueLanguages;
}

function displayLanguagesSelect() {
    let selector = document.getElementById("guideLanguagePlace");
    selector.innerHTML = '';
    selector.appendChild(createOption("Не выбран"));
    let uniqueObjects = getUniqueLanguages();
    uniqueObjects.forEach(name => {
        selector.appendChild(createOption(name));
    });
}

function guideLanguageFilter() {
    let selector = document.getElementById("guideLanguagePlace");
    let selectedOption = selector.options[selector.selectedIndex];

    if (selectedOption.value === "Не выбран") {
        filteredGuides = allGuides;
    } else {
        filteredGuides = allGuides.filter(guide => {
            return guide.language.toString() === selectedOption.value;
        });
    }
    updatePaginationGuides(1);
    displayGuidesTable();
}

//Опыт работы Гида
function guideExpFilter() {
    guideLanguageFilter();

    let maxExp = parseInt(document.getElementById("maxExp").value);
    let minExp = parseInt(document.getElementById("minExp").value);

    if (!isNaN(minExp) && isNaN(maxExp)) {
        filteredGuides = filteredGuides.filter(guide =>{
            return parseInt(guide.workExperience) >= minExp;
        });
    } else if (isNaN(minExp) && !isNaN(maxExp)) {
        filteredGuides = filteredGuides.filter(guide =>{
            return parseInt(guide.workExperience) <= maxExp;
        });
    } else if (!isNaN(minExp) && !isNaN(maxExp)) {
        filteredGuides = filteredGuides.filter(guide =>{
            return parseInt(guide.workExperience) <= maxExp && parseInt(guide.workExperience) >= minExp;
        });
    }
    updatePaginationGuides(1);
    displayGuidesTable();
}

function updatePagination(value) {
    currentPageRoutes = value;
    totalCount = filteredRoutes.length;

    document.getElementById("page-start").innerText = currentPageRoutes.toString();
    let maxPages = filteredRoutes.length / rowsPerPageRoutes;
    if (Math.floor(maxPages) < maxPages) {
        maxPages = Math.floor(maxPages) + 1;
    } else {
        maxPages = Math.floor(maxPages);
    }
    document.getElementById("page-end").innerText = maxPages.toString();

    let isLastPage = currentPageRoutes >= Math.ceil(totalCount / rowsPerPageRoutes);
    let isFirstPage = currentPageRoutes === 1;

    if (isLastPage) {
        document.getElementById("next").className = "page-link text-warning disabled";
    } else {
        document.getElementById("next").className = "page-link text-warning";
    }

    if (isFirstPage) {
        document.getElementById("prev").className = "page-link disabled text-warning";
    } else {
        document.getElementById("prev").className = "page-link text-warning";
    }
    displayRoutesTable();
}

function clickOnPagination(event) {
    let listElement = event.target;
    if (listElement.getElementsByClassName("page-link").length === 0) {
        if (listElement.id === "next" && currentPageRoutes < filteredRoutes.length / rowsPerPageRoutes) {
            updatePagination(parseInt(currentPageRoutes) + 1);
        } else if (listElement.id === "prev" && parseInt(currentPageRoutes) > 1) {
            updatePagination(parseInt(currentPageRoutes) - 1);
        }
    }
}

function updatePaginationGuides(value) {
    let totalCountGuides = filteredGuides.length; 
    currentPageGuides = value;
    totalCountGuides = filteredGuides.length;

    document.getElementById("page-start-guides").innerText = currentPageGuides.toString();
    let maxPages = filteredGuides.length / rowsPerPageGuides;
    if (Math.floor(maxPages) < maxPages) {
        maxPages = Math.floor(maxPages) + 1;
    } else {
        maxPages = Math.floor(maxPages);
    }
    document.getElementById("page-end-guides").innerText = maxPages.toString();

    let isLastPage = currentPageGuides >= Math.ceil(totalCountGuides / rowsPerPageGuides);
    let isFirstPage = currentPageGuides === 1;

    if (isLastPage) {
        document.getElementById("next-guides").className = "page-link text-warning disabled";
    } else {
        document.getElementById("next-guides").className = "page-link text-warning";
    }

    if (isFirstPage) {
        document.getElementById("prev-guides").className = "page-link text-warning disabled";
    } else {
        document.getElementById("prev-guides").className = "page-link text-warning";
    }
    displayGuidesTable();
}

function submitButton() {
    const button = document.getElementById('submitButton');

    button.addEventListener('click', async () => {
        const response = await fetch('http://edu.std-900.ist.mospolytech.ru/api/orders?api_key=${api_key}', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "item1": "data1",
                "item2": "data2",
            })
        });
    });

}

function clickOnPaginationGuides(event) {
    let listElement = event.target;
    if (listElement.getElementsByClassName("page-link").length === 0) {
        if (listElement.id === "next-guides" && currentPageGuides < filteredGuides.length / rowsPerPageGuides) {
            updatePaginationGuides(parseInt(currentPageGuides) + 1);
        } else if (listElement.id === "prev-guides" && parseInt(currentPageGuides) > 1) {
            updatePaginationGuides(parseInt(currentPageGuides) - 1);
        }
    }
}

window.onload = function () {
    getRoutes();
    document.getElementById("searchName").addEventListener("input", routeSearchFilter);
    document.getElementById("selectObject").addEventListener("change", routeObjectFilter);
    document.getElementById("pagination").addEventListener("click", clickOnPagination);

    document.getElementById("guideExpSearch").addEventListener("click", guideExpFilter);
    document.getElementById("guideLanguagePlace").addEventListener("change", guideLanguageFilter);
    document.getElementById("pagination-guides").addEventListener("click", clickOnPaginationGuides);
}

