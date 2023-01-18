let tbody = document.getElementById("tbodyContent")

function fetchData() {
    //fetch 
    fetch("http://localhost:3000/Events")

        //.then(res => console.log(res)) 
        .then(res => res.json())

        .then(json => {
            json.map(data => {
                // console.log(data);
                arrProbabilityAwayTeam.push(data.probability_away_team_winner);
                arrProbabilityDraw.push(data.probability_draw);
                arrProbabilityHomeTeam.push(data.probability_home_team_winner);
                tbody.append(createData(data));
            })
        })
}






    
let arrProbabilityAwayTeam = [];
let arrProbabilityDraw = [];
let arrProbabilityHomeTeam = [];

let elementCounter = 0;
let numberOfResults = 10;




//creating data
function createData({ start_date, venue, competitors, probability_home_team_winner, probability_draw, probability_away_team_winner }) {


    // creating the correct date form
    const date = start_date.replace('T', '<br />').replace('+00:00', '');



    // extracting nested data (team's name and country)
    function getNames(team) {
        return [`<span class="tr-team">${team.name} (<i class="country">${team.country}</i>)</span>`];
    }




    // searching the match result with the highest value
    let highestProbabilityMessage = `<span> class="away-win-text"AWAY TEAM WIN:(<b>${probability_away_team_winner}</b>)</span>`;
    let highestProbability = probability_away_team_winner;

    if (highestProbability < probability_draw) {
        highestProbabilityMessage = `<span class="draw-text">DRAW (<b>${probability_draw}</b>)</span>`;
        highestProbability = probability_draw;
    }
    else if (highestProbability < probability_home_team_winner) {
        highestProbabilityMessage = `<span class="home-win-text">HOME TEAM WIN (<b>${probability_home_team_winner}</b>)</span>`;
        highestProbability = probability_home_team_winner;
    }




    // sorting data & pushing all (73) most probable results to separated array, then, depending on variable, picking array's specified data so it can be printed correctly
    function sortAndGetGreatestProbability() {

        let highestProbabilitesArray = [];


        for (let i = 0; i < arrProbabilityAwayTeam.length; i++) {

            if (arrProbabilityAwayTeam[i] > arrProbabilityDraw[i] && arrProbabilityAwayTeam[i] > arrProbabilityHomeTeam[i]) {
                highestProbabilitesArray.push(arrProbabilityAwayTeam[i]);
            }
            else if (arrProbabilityDraw[i] > arrProbabilityAwayTeam[i] && arrProbabilityDraw[i] > arrProbabilityHomeTeam[i]) {
                highestProbabilitesArray.push(arrProbabilityDraw[i]);
            }
            else if (arrProbabilityHomeTeam[i] > arrProbabilityAwayTeam[i] && arrProbabilityHomeTeam[i] > arrProbabilityDraw[i]) {
                highestProbabilitesArray.push(arrProbabilityHomeTeam[i]);
            }

        }
        highestProbabilitesArray = highestProbabilitesArray.sort(function (a, b) { return b - a; });


        let factor = highestProbabilitesArray[numberOfResults];

        if (factor === highestProbabilitesArray[numberOfResults - 1]) { // this if allows to print correct number of results in case there are same probability values 
            factor -= 0.1;
        }

        return factor;
    }


    // creating most probable match results based on comparing 'sortAndGetGreatestProbability' function's return and 'highestProbability' variable
    let tableData = document.createElement('tr');

    setTimeout(function () {
        if (highestProbability < sortAndGetGreatestProbability()) {
            tableData = '';
        }
        else if (highestProbability > sortAndGetGreatestProbability() && elementCounter < numberOfResults || arrProbabilityAwayTeam.length == numberOfResults) {
            tableData.innerHTML = `
            <td>${date === null ? "No data yet" : date}</td>
            <td>${competitors === null ? "No data yet" : competitors.map(getNames).join("<br/>vs.<br/>")}</td> 
            <td>${venue === null ? "No data yet" : venue.name}</td>  
            <td>${probability_home_team_winner === null || probability_draw === null || probability_away_team_winner === null ? "No data yet" : highestProbabilityMessage}</td>
            `;
            elementCounter++;
        }
    }, 100);

    return tableData;
}



// search by button
tbody.parentNode.getElementsByTagName('tbody')[0].innerHTML = '';
fetchData();

function searchByButton() {
    
    arrProbabilityAwayTeam = [];
    arrProbabilityDraw = [];
    arrProbabilityHomeTeam = [];

    tbody.parentNode.getElementsByTagName('tbody')[0].innerHTML = '';
    
    let inputValue = document.getElementById('searchbar').value;
    
    numberOfResults = inputValue;
    elementCounter = 0;
    highestProbability = 0;

    
    fetchData();
}

// adding keypress 
let inputEnter = document.getElementById('searchbar');
    inputEnter.addEventListener("keypress", function(e) {
        if(e.key === "Enter") {
            e.preventDefault();
            document.getElementById('btn').click();
        }
        
    });