/*
API's:
https://api.coingecko.com/api/v3/coins/{id}
*/

//Problems with graph Line 311




const app = {
    MAX_SECONDS: 120,
    newArrayOfCoins: [],
    coinsselectedArray: [],
    allCoinObjArray: [],
    chartHandlerArray: [],
    coinId: 0
}

function allCoinsRequest() {
    app.newArrayOfCoins = JSON.parse(window.sessionStorage.getItem('allCoins'));
    if (app.newArrayOfCoins !== undefined && app.newArrayOfCoins !== null) {
        mainBuild();
    } else {
        $.get('https://api.coingecko.com/api/v3/coins/list', (obj) => {
            app.newArrayOfCoins = [...obj].slice(299, 599);
            app.coinId = 0;
            app.newArrayOfCoins.map((element) => {
                element.coinId = app.coinId;
                app.coinId++;
                //console.log(obj);
                let coinObj = new Coin(element.id, element.coinId, element.symbol, element.name, false);
                app.allCoinObjArray.push(coinObj);
            });
            window.sessionStorage.setItem('allcoins', JSON.stringify(app.newArrayOfCoins));
            mainBuild();
        })
    }
}


function main() {
    allCoinsRequest();
    $('#homeBtn').click(mainBuild);
    $('.chosenCoinsBtn').click(chosenCoinsBtn);
    $('#liveReportsBtn').click(loadLiveReports);
    $('#searchBtn').click(search);
}

function clearApi() {
    for (let i = 0; i < app.chartHandlerArray.length; i++) {
        clearInterval(app.chartHandlerArray[i]);
    }
}
function mainBuild() {
    emptyRow();
    clearApi();
    app.newArrayOfCoins.forEach((element, idx) => {
        //console.log(element);
        $('#row').append(`<div id="cardBody${idx}" class="card cardDiv col-md-2 mr-3 mt-3 "></div>`);
        $('#cardBody' + idx).append(`
            <label class="switch">
                <input id="toggleButton${element.coinId}" class="myToggleBtn" data-coin-name="${element.symbol}" data-original-id=${element.id} data-coin-id-for-active="${element.coinId}" type="checkbox">
                <div class="slider round"></div>
            </label>
            <h3>${element.symbol.toUpperCase()}</h3>
            <h7>${element.name}<br> <br></h7>
            <button id="button${idx}" class="btn-primary" data-coinid="${element.id}">More info</button>
                <div id="dropdown${element.coinId}"></div>`);
        $(`#toggleButton${element.coinId}`).click(toggleCoin);
        $(`#button${idx}`).click(moreInfoBtn);
    });
    updateToggles();
}

function toggleCoin() {
    console.log(this);
    console.log(app.coinsselectedArray);
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

    let uncheckedCoins = [];
    for (let i = 0; i < app.allCoinObjArray.length; i++) {
        if (!app.allCoinObjArray[i].checked) {
            uncheckedCoins.push(app.allCoinObjArray[i]);
        }
    }

    if (app.coinsselectedArray.length >= 5) {
        for (let i = 0; i < uncheckedCoins.length; i++) {
            let toggleButton = document.getElementById('toggleButton' + uncheckedCoins[i].id);
            toggleButton.disabled = true;
        }
    } else {
        for (let i = 0; i < app.allCoinObjArray.length; i++) {
            let toggleButton = document.getElementById('toggleButton' + app.allCoinObjArray[i].id);
            toggleButton.disabled = false;
        }
    }

}

function isCheckedFull() {
    if (app.coinsselectedArray.length >= 5) {
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
        </div>`;

        let toggle = document.getElementById('switch' + element.id);
        toggle.addEventListener('click', toggleCoin);
    }

    for (let i = 0; i < app.coinsselectedArray.length; i++) {
        let element = app.coinsselectedArray[i];
        let toggle = document.getElementById('popup-t' + element.id);
        if (element.checked) {
            toggle.checked = true;
        }
    }
    let closeBtn = document.createElement('div');
    closeBtn.innerHTML = 'X';
    closeBtn.className = 'closeBtn';
    closeBtn.addEventListener('click', () => {
        $('.overlay').remove();
        updateHomeToggles();
    });
    popUp.appendChild(closeBtn);
}
function updateHomeToggles() {
    console.log(app.allCoinObjArray);
    for (let i = 0; i < app.allCoinObjArray.length; i++) {
        if (app.allCoinObjArray[i].checked) {
            $('#toggleButton' + app.allCoinObjArray[i].id).attr('checked', true);
        } else {
            $('#toggleButton' + app.allCoinObjArray[i].id).attr('checked', false);
        }


    }
}
function Coin(originalId, id, symbol, name, checked) {
    this.originalId = originalId;
    this.id = id;
    this.symbol = symbol;
    this.name = name;
    this.checked = checked;
}

function chosenCoinsBtn() {
    if($('#chartDiv')){
        $('#chartDiv').empty();
    }
    $('.row').remove();
    mainBuild = document.getElementById('mainBuild');
    console.log(app.coinsselectedArray);
    let newRow = document.createElement('div');
    newRow.className = 'row';
    newRow.id = 'row';
    mainBuild.appendChild(newRow);
    for (let i = 0; i < app.coinsselectedArray.length; i++) {
        $('#row').append(`<div id="cardBody${i}" class="card cardDiv col-md-2 mr-3 mt-3 ">
        <label class="switch" id="switch${app.coinsselectedArray[i].id}">
        <input id="popup-t${app.coinsselectedArray[i].id}" class="myToggleBtn" type="checkbox">
        <div class="slider round"></div>
        </label>
        <h3>${app.coinsselectedArray[i].symbol.toUpperCase()}</h3>
        <h7>${app.coinsselectedArray[i].name}<br> <br></h7>
        <button id="button${app.coinsselectedArray[i].id}" class="btn-primary" data-coinid="${app.coinsselectedArray[i].id}">More info</button>
                <div class="infoDropDown" id="dropdown${app.coinsselectedArray[i].id}"></div>
    </div>`);


    }

    for (let i = 0; i < app.coinsselectedArray.length; i++) {
        let element = app.coinsselectedArray[i];
        if (element.checked) {
            let toggle = document.getElementById('popup-t' + app.coinsselectedArray[i].id);
            toggle.addEventListener('click', toggleCoin);
            toggle.checked = true;
        }
    }
}
function updateToggles() {
    if (app.coinsselectedArray.length > 0) {
        let selectedIDS = [];
        for (let i = 0; i < app.coinsselectedArray.length; i++) {
            selectedIDS.push(app.coinsselectedArray[i].id);
        }

        for (let i = 0; i < app.newArrayOfCoins.length; i++) {
            if (selectedIDS.indexOf(app.newArrayOfCoins[i].coinId) != -1) {
                let button = document.getElementById('toggleButton' + app.newArrayOfCoins[i].coinId);
                button.checked = true;
            }
        }
    }
}
function emptyRow() {
    let newDiv = document.getElementById('row');
    $(newDiv).empty();
}

async function moreInfoBtn() {
    console.log("this clicked");
    let coinIdx = (this.id).substr(6);
    let coinID = this.dataset.coinid;
    let moreInfoDiv = document.getElementById('dropdown' + coinIdx);
    moreInfoDiv.className = 'more-info';
    console.log(moreInfoDiv);
    if ($(moreInfoDiv).is(':empty')) {
        $(moreInfoDiv.parentNode).css('height', '322px');
        moreInfoDiv.innerHTML = 'Loading...';
        $.getJSON('https://api.coingecko.com/api/v3/coins/' + coinID, (res) => {
            moreInfoDiv.innerHTML = `
            <img src="${res.image.small}"/> <br>
            USD : ${res.market_data.current_price.usd} <br>
            EUR : ${res.market_data.current_price.eur}<br>
            ILS : ${res.market_data.current_price.ils}`;
        });
    } else {
        $(moreInfoDiv).empty();
        $(moreInfoDiv.parentNode).css('height', '201px');
    }

}

function loadLiveReports() {
    $('.row').remove();
    mainBuild = document.getElementById('mainBuild');
    let newRow = document.createElement('div');
    newRow.className = 'row';
    newRow.id = 'row';
    mainBuild.appendChild(newRow);
    if (app.coinsselectedArray.length > 0) {
        CreateLiveGraph();
    } else {
        alert('You gotta choose up to 5 coins to show a live report.');
    }

}

function CreateLiveGraph() {

    let chartTitle = '';
    const chartDiv = document.createElement("div");
    chartDiv.id = "chartDiv";
    chartDiv.className = 'animated fadein'
    var options = {
        exportEnabled: true,
        animationEnabled: true,
        title: {
            text: chartTitle,
        },

        axisX: {
            title: "Time"
        },
        axisY: {
            title: "Coin Value",
            titleFontColor: "#4F81BC",
            lineColor: "#4F81BC",
            labelFontColor: "#4F81BC",
            tickColor: "#4F81BC",
            includeZero: false
        },
        axisY2: {
            titleFontColor: "#C0504E",
            lineColor: "#C0504E",
            labelFontColor: "#C0504E",
            tickColor: "#C0504E",
            includeZero: false
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
        },
        data: [],
    };

    $(chartDiv).CanvasJSChart(options);
    let chart = $(chartDiv).CanvasJSChart();
    let loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = 'Loading...';
    let mainBuild = document.getElementById('mainBuild');
    mainBuild.appendChild(loading);
    for (let i = 0; i < app.coinsselectedArray.length; i++) { //Api loop
        let coinObj = {
            type: "spline",
            name: app.coinsselectedArray[i].name,
            showInLegend: true,
            xValueFormatString: "HH:mm:ss",
            yValueFormatString: "$#,##0.#",
            dataPoints: [],

        }
        options.title.text += `${app.coinsselectedArray[i].symbol},  `.toUpperCase();
        options.title.text = options.title.text.substr(0, options.title.text.length - 1);
        options.data.push(coinObj);

        let apiHandler = setInterval(() => {

            //app.clearDiv();
            $.getJSON('https://api.coingecko.com/api/v3/coins/' + app.coinsselectedArray[i].originalId, function (res) { //couldn't fix the problem the graph works but i cant get the id of the array right for some reason
                let loading = document.getElementById('loading');
                if (loading) {
                    loading.parentNode.removeChild(loading);
                }
                coinObj.dataPoints.push({ x: new Date(), y: res.market_data.current_price.usd });
                chart.render();
            });
        }, 2000);
        app.chartHandlerArray.push(apiHandler);



    }
    options.title.text += "to USD";
    document.body.appendChild(chartDiv);




    function toggleDataSeries(e) {
        console.log(e);
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
}

function search(){
    let searchValue = document.getElementById('search').value;
    console.log(searchValue);
    for(let i = 0; i < app.allCoinObjArray.length;i++){
       
        if(app.allCoinObjArray[i].originalId == searchValue){
            console.log(app.allCoinObjArray[i]);
            oneCoin(app.allCoinObjArray[i]);
        }
    }

}

function oneCoin(coinObj){

    clearApi();
        //console.log(element);
        $('#row').append(`<div id="cardBody${coinObj.id}" class="card cardDiv col-md-2 mr-3 mt-3 "></div>`);
        $('#cardBody' + coinObj.id).append(`
            <label class="switch">
                <input id="toggleButton${coinObj.id}" class="myToggleBtn" data-coin-name="${coinObj.symbol}" data-original-id=${coinObj.originalId} data-coin-id-for-active="${coinObj.originalId}" type="checkbox">
                <div class="slider round"></div>
            </label>
            <h3>${coinObj.symbol.toUpperCase()}</h3>
            <h7>${coinObj.name}<br> <br></h7>
            <button id="button${coinObj.id}" class="btn-primary" data-coinid="${coinObj.originalId}">More info</button>
                <div id="dropdown${coinObj.id}"></div>`);
        $(`#toggleButton${coinObj.id}`).click(toggleCoin);
        $(`#button${coinObj.id}`).click(moreInfoBtn);

    updateToggles();
}

main();