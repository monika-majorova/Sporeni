/* global React, ReactDOM */

var goals = [];
var sectors = [];

function addGoal(name, months, amount) {
    goals[goals.length] = {id:goals.length, name:name, months: months, amount: amount};
}

//addGoal("C1", 5, 15000);
//addGoal("C2", 8, 25000);
//addGoal("C3", 13, 12500);

function submitGoal() {
    addGoal(document.forms['goal-form']['goal-name'].value, Number(document.forms['goal-form']['goal-months'].value), Number(document.forms['goal-form']['goal-amount'].value));
    ReactDOM.render(SporeniAppFactory({}), document.getElementById('container'));
}

function writeGoal(goal) {
    return React.createElement('li', null, (goal.id + 1) + ": " + goal.name + " za " + goal.months + " měsíců za " + goal.amount + " Kč.");
}

function writeGoals() {
    goals = sortGoals();
    var output = [];
    for (var i = 0; i < goals.length; i++) {
        output[output.length] = writeGoal(goals[i]);
    }
    return output;
}

function addSector(toMonth, monthlyAmount) {
    sectors[sectors.length] = {id:sectors.length, toMonth:toMonth, monthlyAmount:monthlyAmount};
}

function writeSector(sector) {
    return React.createElement('li', null, (getLastMonthOfPreviousSector(sector) + 1) + ". - " + sector.toMonth + ". měsíc | " + sector.monthlyAmount + " Kč");
}

function writeSectors() {
    countResult();
    var output = [];
    for (var i = 0; i < sectors.length; i++) {
        output[output.length] = writeSector(sectors[i]);
    }
    return output;
}

function countResult() {
    sectors = [];
    sortedGoals = sortGoals();
    var i;
    for (var i = 0; i < goals.length; i++) {
        var firstMonth = sectors.length === 0 ? 0 : lastSector().toMonth;
        var amount = goals[i].amount;
        var months = goals[i].months;
        var monthlyAmount = goals[i].amount / (goals[i].months - firstMonth);

        addSector(goals[i].months, monthlyAmount);

        // Rozpočítání do ostatních sektorů:
        while (sectors.length > 1) { // Pokud existují alespoň 2 sektory.
            if (lastSector().monthlyAmount > penultimateSector().monthlyAmount) {
                // Pokud je v novém sektoru částka vyšší, rozpočítáme ji do obou sektorů:
                var newMonthlyAmount = (lastSector().monthlyAmount * numberOfMonthsInSector(lastSector()) + penultimateSector().monthlyAmount * numberOfMonthsInSector(penultimateSector())) / (numberOfMonthsInSector(lastSector()) + numberOfMonthsInSector(penultimateSector()));

                // Následně sektory spojíme (mají stejnou částku):
                penultimateSector().monthlyAmount = newMonthlyAmount;
                penultimateSector().toMonth = lastSector().toMonth;
                sectors.pop(); // Odebere poslední sektor.
            } else if (lastSector().monthlyAmount === penultimateSector().monthlyAmount) {
                // Pokud jsou částky shodné, pouze spojíme oba sektory do jednoho:
                penultimateSector().toMonth = lastSector().toMonth;
                sectors.pop(); // Odebere poslední sektor.
            } else {
                break; // Pokud je v minulém sektoru částka vyšší, končíme s rozpočítáváním.
            }
        }
    }
}

function sortGoals() {
    var output = [];
    for (var i = 0; i < goals.length; i++) {
        output[i] = goals[i];
    }
    output.sort(compareGoals);
    return output;
}

function compareGoals(goalA, goalB) {
    return goalA.months - goalB.months;
}

function  numberOfMonthsInSector(sector) {
    return sector.toMonth - getLastMonthOfPreviousSector(sector);
}

function lastSector() {
    return sectors.length > 0 ? sectors[sectors.length - 1] : null;
}

function penultimateSector() {
    return sectors.length > 1 ? sectors[sectors.length - 2] : null;
}

function getLastMonthOfPreviousSector(sector) {
    return sector.id <= 0 ? 0 : sectors[sector.id - 1].toMonth;
}


var SporeniApp = React.createClass({
    render: function() {
        return React.createElement('div', null, 
            React.createElement('h2', null, 'Cíle'),
            React.createElement(Goals, null),
            React.createElement('h2', null, 'Kolik spořit'),
            React.createElement(Sectors, null)
        );
    }
});

var Goals = React.createClass({
    render: function() {
        return React.createElement('ul', null, writeGoals());
    }
});

var Sectors = React.createClass({
   render: function() {
        return React.createElement('ul', null, writeSectors());
    } 
});

var SporeniAppFactory = React.createFactory(SporeniApp);
ReactDOM.render(SporeniAppFactory({}), document.getElementById('container'));