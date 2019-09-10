/*
API's:
https://api.coingecko.com/api/v3/coins/{id}
*/




const app = {
    MAX_SECONDS: 120,
    newArrayOfCoins: [],
    coinsselectedArray: [],
    allCoinObjArray: [],
    coinId: 0
}

function allCoinsRequest() {
    app.newArrayOfCoins = JSON.parse(window.sessionStorage.getItem('allCoins'));
    if (app.newArrayOfCoins !== undefined && app.newArrayOfCoins !== null) {
        mainBuild();
    } else {
        $.get('https://api.coingecko.com/api/v3/coins/list', (obj) => {
            app.newArrayOfCoins = [...obj].slice(299, 399);
            app.coinId = 0;
            app.newArrayOfCoins.map((element) => {
                element.coinId = app.coinId;
                app.coinId++;

                let coinObj = new Coin(element.coinId, element.symbol, element.name, false);
                app.allCoinObjArray.push(coinObj);
            });
            window.sessionStorage.setItem('allcoins', JSON.stringify(app.newArrayOfCoins));
            mainBuild();
        })
    }
}


function main() {
    allCoinsRequest();
    $('#homeBtn').click(allCoinsRequest);
    $('.chosenCoinsBtn').click(chosenCoinsBtn);
}

function mainBuild() {
    console.log(app.newArrayOfCoins);

    app.newArrayOfCoins.forEach((element, idx) => {
        $('#row').append(`<div id="cardBody${idx}" class="card cardDiv col-md-2 mr-3 mt-3 "></div>`);
        $('#cardBody' + idx).append(`
            <label class="switch">
                <input id="toggleButton${element.coinId}" class="myToggleBtn" data-coin-name="${element.symbol}" data-coin-id-for-active="${element.coinId}" type="checkbox">
                <div class="slider round"></div>
            </label>
            <h3>${element.symbol.toUpperCase()}</h3>
            <h7>${element.name}<br> <br></h7>
            <button id="button${idx} class="info-btn primary-btn" data-toggle="collapse" data-target="#more-info-btn${idx}" data-coin-for-info="${element.id}">More info</button>
            <div id="more-info-btn${idx}" class="collapse">
                <div class="infoDropDown"></div>
            </div>`);
        $(`#toggleButton${element.coinId}`).click(toggleCoin);
        $(`#button${idx}`).click(moreInfoBtn);
    });
}

function toggleCoin() {
    let id = this.id.substr(12);
    if (this.checked) { //check
        for (let i = 0; i < app.allCoinObjArray.length; i++) {
            if (id == app.allCoinObjArray[i].id) {
                app.allCoinObjArray[i].checked = true;
                let idx = app.coinsselectedArray.indexOf(app.allCoinObjArray[i]);
                if (idx == -1) {
                    app.coinsselectedArray.push(app.allCoinObjArray[i]);
                    isCheckedFull();

                }
            }
        }
    } else if (!this.checked) { //uncheck
        for (let i = 0; i < app.allCoinObjArray.length; i++) {
            if (id == app.allCoinObjArray[i].id) {
                app.allCoinObjArray[i].checked = false;
                let idx = app.coinsselectedArray.indexOf(app.allCoinObjArray[i]);
                app.coinsselectedArray.splice(idx, 1);
            }
        }
    }
}

function isCheckedFull() {
    if (app.coinsselectedArray.length > 5) {
        console.log('fulll');
        writePopUp();
    }
}

function writePopUp() {
    let mainBuild = document.getElementById('mainBuild');
    let overlay = document.createElement('div');
    overlay.className = 'overlay';
    let popUp = document.createElement('div');
    popUp.className = 'popup';
    popUp.id = 'popup';
    overlay.appendChild(popUp);
    mainBuild.appendChild(overlay);
    for (let i = 0; i < app.coinsselectedArray.length; i++) {
        let element = app.coinsselectedArray[i];
        popUp.innerHTML += `
        <div id="popup-cardBody${i}" class="card cardDiv col-md-2 mr-3 mt-3 ">
        <label class="switch" id="switch${element.id}">
        <input id="popup-t${element.id}" class="myToggleBtn" type="checkbox">
        <div class="slider round"></div>
        </label>
        <h3>${element.symbol.toUpperCase()}</h3>
        <h7>${element.name}<br> <br></h7>
        </div>`
        $(`#popup-t${element.id}`).click(toggleCoin);
    }

    for (let i = 0; i < app.coinsselectedArray.length; i++) {
        let element = app.coinsselectedArray[i];
        if (element.checked) {
            let toggle = document.getElementById('popup-t' + element.id);
            toggle.checked = true;
        }
    }
    let closeBtn = document.createElement('div');
    closeBtn.innerHTML = 'X';
    closeBtn.className = 'closeBtn';
    closeBtn.addEventListener('click', () => {
        $('.overlay').remove();
    });
    popUp.appendChild(closeBtn);

}
function Coin(id, symbol, name, checked) {
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.checked = checked;
}

function chosenCoinsBtn() {
    $('.row').remove();
    mainBuild = document.getElementById('mainBuild');
    console.log(app.coinsselectedArray);
    let newRow = document.createElement('div');
    newRow.className = 'row';
    newRow.id = 'row';
    mainBuild.appendChild(newRow);
    for (let i = 0; i < app.coinsselectedArray.length ; i++) {
        $('#row').append(`<div id="popup-cardBody${i}" class="card cardDiv col-md-2 mr-3 mt-3 ">
        <label class="switch" id="switch${app.coinsselectedArray[i].id}">
        <input id="popup-t${app.coinsselectedArray[i].id}" class="myToggleBtn" type="checkbox">
        <div class="slider round"></div>
        </label>
        <h3>${app.coinsselectedArray[i].symbol.toUpperCase()}</h3>
        <h7>${app.coinsselectedArray[i].name}<br> <br></h7>
        <button id="button${i} class="info-btn primary-btn" data-toggle="collapse" data-target="#more-info-btn${i}" data-coin-for-info="${app.coinsselectedArray[i].id}">More info</button>
            <div id="more-info-btn${i}" class="collapse">
                <div class="infoDropDown"></div>
            </div>
    </div>`);
    }

    for(let i=0; i<app.coinsselectedArray.length; i++){
        let element = app.coinsselectedArray[i];
        if(element.checked){
            let toggle = document.getElementById('popup-t'+app.coinsselectedArray[i].id);
            toggle.checked = true;
        }
    }
}

function moreInfoBtn() {
    let coinIdx = (this.id).substr(6);
    let dataCoinForInfo = this.dataset.coinForInfo;
    
}


main();