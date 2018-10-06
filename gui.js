/* global React, ReactDOM, sectors */

/**
 * Zpráva pro uživatele.
 * @type String HTML obsah zprávy pro uživatele.
 */
var message = "";

/**
 * Odeslat cíl z formuláře do seznamu cílů a překreslit aplikaci (provede se automaticky výpočet sektorů).
 * @returns {undefined} Nic.
 */
function submitGoal() {
    addGoal(document.forms['goal-form']['goal-name'].value, Number(document.forms['goal-form']['goal-months'].value), Number(document.forms['goal-form']['goal-amount'].value));
    ReactDOM.render(SporeniAppFactory({}), document.getElementById('container'));
}

/**
 * Smazat zadaný cíl ze seznamu cílů a překreslit aplikaci (provede se automaticky výpočet sektorů).
 * @param {type} goalId ID cíle, který se má smazat.
 * @returns {undefined} Nic.
 */
function deleteGoal(goalId) {
    message = removeGoal(goalId) ? "<span class=\"uspech\">Cíl byl odstraněn.</span>" : "<span class=\"neuspech\">Zadaný cíl nelze odstranit (nebyl nalezen).</span>";
    ReactDOM.render(SporeniAppFactory({}), document.getElementById('container'));
}

/**
 * Vytvoří cíl pro GUI.
 * @param {type} goal Cíl.
 * @returns {unresolved} HTML element cíle.
 */
function writeGoal(goal) {
    return React.createElement('li', null, (goal.id + 1) + ": " + goal.name + " za " + goal.months + " měsíců za " + goal.amount + " Kč.",
        React.createElement('button', {'type':'button', 'onClick':function (){deleteGoal(goal.id)}}, "Smazat"));
}

/**
 * Vytvoří seznam cílů pro GUI.
 * @returns {Array|writeGoals.output} Seznam HTML elementů cílů.
 */
function writeGoals() {
    goals = sortGoals();
    var output = [];
    for (var i = 0; i < goals.length; i++) {
        output[output.length] = writeGoal(goals[i]);
    }
    return output;
}

/**
 * Vytvoří sektor pro GUI.
 * @param {type} sector Sektor.
 * @returns {unresolved} HTML element sektoru.
 */
function writeSector(sector) {
    return React.createElement('li', null, (getLastMonthOfPreviousSector(sector) + 1) + ". - " + sector.toMonth + ". měsíc | " + sector.monthlyAmount + " Kč");
}

/**
 * Vytvoří seznam sektorů pro GUI.
 * @returns {Array|writeSectors.output} Seznam HTML elementů sektorů.
 */
function writeSectors() {
    countResult();
    var output = [];
    for (var i = 0; i < sectors.length; i++) {
        output[output.length] = writeSector(sectors[i]);
    }
    return output;
}

/**
 * React třída reprezentující aplikaci Spoření.
 * @type type
 */
var SporeniApp = React.createClass({
    render: function() {
        return React.createElement('div', null, 
            React.createElement('div', null, message),
            React.createElement('h2', null, 'Cíle'),
            React.createElement(Goals, null),
            React.createElement('h2', null, 'Kolik spořit'),
            React.createElement(Sectors, null)
        );
    }
});

/**
 * React třída reprezentující seznam cílů.
 * @type type
 */
var Goals = React.createClass({
    render: function() {
        return React.createElement('ul', null, writeGoals());
    }
});

/**
 * React třída reprezentující seznam sektorů.
 * @type type
 */
var Sectors = React.createClass({
   render: function() {
        return React.createElement('ul', null, writeSectors());
    } 
});

// Vykreslit aplikaci:
var SporeniAppFactory = React.createFactory(SporeniApp);
ReactDOM.render(SporeniAppFactory({}), document.getElementById('container'));