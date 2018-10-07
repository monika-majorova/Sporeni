/* global React, ReactDOM, sectors */

/**
 * Zpráva pro uživatele.
 * @type String HTML obsah zprávy pro uživatele.
 */
var message = "";

/**
 * CSS třída zprávy pro uživatele (pro správné obarvení).
 * @type String
 */
var messageClass = "";

/**
 * ID cíle, který upravujeme (záporné číslo, pokud žádný neupravujeme).
 * @type Number
 */
var editGoalId = -1;

/**
 * Překreslit formulář?
 * @type Boolean
 */
var reloadForm = false;

/**
 * Odeslat cíl z formuláře do seznamu cílů a překreslit aplikaci (provede se automaticky výpočet sektorů).
 * @returns {undefined} Nic.
 */
function submitGoal() {
    if (editGoalId >= 0) {
        if (editGoal(Number(document.forms['goal-form']['goal-edit-id'].value), document.forms['goal-form']['goal-name'].value, Number(document.forms['goal-form']['goal-months'].value), Number(document.forms['goal-form']['goal-amount'].value))) {
            message = "Cíl byl upraven.";
            messageClass = "uspech";
        } else {
            message = "Zadaný cíl nelze upravit (nebyl nalezen).";
            messageClass = "neuspech";
        }
    } else {
        addGoal(document.forms['goal-form']['goal-name'].value, Number(document.forms['goal-form']['goal-months'].value), Number(document.forms['goal-form']['goal-amount'].value));
    }
    editGoalId = -1;
    reloadForm = true;
    renderApp();
}

/**
 * Zobrazí formulář pro editaci cíle.
 * @param {type} goalId ID cíle pro editaci.
 * @returns {undefined}
 */
function editGoalForm(goalId) {
    editGoalId = goalId;
    reloadForm = true;
    renderApp();
}

/**
 * Smazat zadaný cíl ze seznamu cílů a překreslit aplikaci (provede se automaticky výpočet sektorů).
 * @param {type} goalId ID cíle, který se má smazat.
 * @returns {undefined} Nic.
 */
function deleteGoal(goalId) {
    if (removeGoal(goalId)) {
        message = "Cíl byl odstraněn.";
        messageClass = "uspech";
    } else {
        message = "Zadaný cíl nelze odstranit (nebyl nalezen).";
        messageClass = "neuspech";
    }
    reloadForm = true;
    renderApp();
}

/**
 * Vytvoří cíl pro GUI.
 * @param {type} goal Cíl.
 * @param {type} goalId ID cíle.
 * @returns {unresolved} HTML element cíle.
 */
function writeGoal(goal, goalId) {
    return React.createElement('li', null, (goalId + 1) + ": " + goal.name + " za " + goal.months + " měsíců za " + goal.amount + " Kč.",
        React.createElement('button', {
            'type':'button',
            'onClick':function () {deleteGoal(goalId);}
        }, "Smazat"),
        React.createElement('button', {
            'type':'button',
            'onClick':function () {editGoalForm(goalId);}
        }, "Upravit")
    );
}

/**
 * Vytvoří seznam cílů pro GUI.
 * @returns {Array|writeGoals.output} Seznam HTML elementů cílů.
 */
function writeGoals() {
    goals = sortGoals();
    var output = [];
    for (var i = 0; i < goals.length; i++) {
        output[output.length] = writeGoal(goals[i], i);
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
            React.createElement('h2', null, editGoalId >= 0 ? 'Upravit cíl' : 'Přidat cíl'),
            React.createElement(GoalForm, null),
            React.createElement('div', {'className':messageClass}, message),
            React.createElement('h2', null, 'Cíle'),
            React.createElement(Goals, null),
            React.createElement('h2', null, 'Kolik spořit'),
            React.createElement(Sectors, null)
        );
    }
});

/**
 * React třída reprezentující formulář pro přidávání / editaci cílů.
 * @type type
 */
var GoalForm = React.createClass({
    render: function() {
        var editGoal = editGoalId >= 0 ? goals[editGoalId] : null;
        if (reloadForm) {
            this.setState( { key: Date.now() } ); // Resetovat hodnoty formuláře.
            reloadForm = false;
        }
        return React.createElement('form', {
            'name':'goal-form',
            'onSubmit':function (e) {e.preventDefault();},
            'key':this.state ? this.state.key : 0
        },
        React.createElement('label', {'htmlFor':'goal-name'}, 'Název cíle: '),
        React.createElement('input', {'type':'text', 'id':'goal-name', 'name':'goal-name', 'defaultValue':editGoal ? editGoal.name : ''}),
        React.createElement('label', {'htmlFor':'goal-months'}, 'Počet měsíců: '),
        React.createElement('input', {'type':'text', 'id':'goal-months', 'name':'goal-months', 'defaultValue':editGoal ? editGoal.months : ''}),
        React.createElement('label', {'htmlFor':'goal-amount'}, 'Částka: '),
        React.createElement('input', {'type':'text', 'id':'goal-amount', 'name':'goal-amount', 'defaultValue':editGoal ? editGoal.amount : ''}),
        React.createElement('input', {'type':'hidden', 'name':'goal-edit-id', 'value':editGoalId}),
        React.createElement('input', {'type':'submit', 'onClick':function () {submitGoal();}, 'value': editGoalId >= 0 ? 'Uložit' : 'Přidat'})
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

/**
 * Překreslit stránku.
 * @returns {undefined}
 */
function renderApp() {
    var SporeniAppFactory = React.createFactory(SporeniApp);
    ReactDOM.render(SporeniAppFactory({}), document.getElementById('container'));
}

// Vykreslit aplikaci:
renderApp();