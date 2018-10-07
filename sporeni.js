/**
 * Seznam zadaných cílů.
 * @type Array
 */
var goals = [];

/**
 * Seznam vypočtených sektorů.
 * @type Array
 */
var sectors = [];

/**
 * Přidá cíl do seznamu cílů.
 * @param {type} name Jméno cíle.
 * @param {type} months Za kolik měsíců chceme cíle dosáhnout.
 * @param {type} amount Částka, kterou chceme naspořit na tento cíl.
 * @returns {undefined} Nic.
 */
function addGoal(name, months, amount) {
    goals[goals.length] = {name:name, months: months, amount: amount};
}

/**
 * Upraví cíl v seznamu cílů.
 * @param {type} goalId ID cíle, který se má upravit.
 * @param {type} newName Nové jméno cíle.
 * @param {type} newMonths Za kolik měsíců chceme cíle nově dosáhnout.
 * @param {type} newAmount Částka, kterou chceme nově naspořit na tento cíl.
 * @returns {Boolean} True, pokud cíl s takovým ID existuje; false, pokud ne.
 */
function editGoal(goalId, newName, newMonths, newAmount) {
    if (goals[goalId]) {
        goals[goalId].name = newName;
        goals[goalId].months = newMonths;
        goals[goalId].amount = newAmount;
        return true;
    } else {
        return false;
    }
}

/**
 * Odebere cíl se zadaným ID ze seznamu cílů.
 * @param {type} goalId ID cíle k odebrání.
 * @returns {undefined} True, pokud cíl s takovým ID existuje; false, pokud ne.
 */
function removeGoal(goalId) {
    if (goals[goalId]) {
        goals.splice(goalId, 1);
        return true;
    } else {
        return false;
    }
}

/**
 * Přidat sektor mezi vypočtené sektory.
 * @param {type} toMonth So kterého měsíce tato částka platí.
 * @param {type} monthlyAmount Kolik je třeba v tomto sektoru šetřit.
 * @returns {undefined} Nic.
 */
function addSector(toMonth, monthlyAmount) {
    sectors[sectors.length] = {id:sectors.length, toMonth:toMonth, monthlyAmount:monthlyAmount};
}

/**
 * Vypočet, kolik je třeba šetřit (hlavní výpočetní funkce). Na základě cílů spočítá sektory.
 * @returns {undefined} Nic.
 */
function countResult() {
    sectors = [];
    sortedGoals = sortGoals();
    var i;
    for (var i = 0; i < goals.length; i++) {
        if (sectors.length > 0 && lastSector().toMonth === goals[i].months) {
            var firstMonth = getLastMonthOfPreviousSector(lastSector());
            var monthlyAmount = goals[i].amount / (goals[i].months - firstMonth);
            lastSector().monthlyAmount += monthlyAmount;
        } else {
            var firstMonth = sectors.length === 0 ? 0 : lastSector().toMonth;
            var monthlyAmount = goals[i].amount / (goals[i].months - firstMonth);
            addSector(goals[i].months, monthlyAmount);
        }

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

/**
 * Seřadí cíle vzestupně dle měsíce, ve kterém jich má být dosaženo. Nemění původní pole cílů.
 * @returns {Array|sortGoals.output} Seřazený seznam cílů.
 */
function sortGoals() {
    var output = [];
    for (var i = 0; i < goals.length; i++) {
        output[i] = goals[i];
    }
    output.sort(compareGoals);
    return output;
}

/**
 * Porovnávací funkce pro cíle (porovnává jejich měsíce).
 * @param {type} goalA První cíl k porovnání.
 * @param {type} goalB Druhý cíl k porovnání.
 * @returns {unresolved} Rozdíl v měsících mezi cíly.
 */
function compareGoals(goalA, goalB) {
    return goalA.months - goalB.months;
}

/**
 * Vypočítá počet měsíců sektoru (s ohledem na konec předchozího sektoru).
 * @param {type} sector Sektor, jehož délka v měsících má být vypočtena.
 * @returns {Number} Délka sektoru v měsících.
 */
function  numberOfMonthsInSector(sector) {
    return sector.toMonth - getLastMonthOfPreviousSector(sector);
}

/**
 * Vrátí poslední existující sektor ze seznamu sektorů.
 * @returns {unresolved} Poslední existující sektor ze seznamu sektorů nebo null, pokud neexistuje žádný sektor.
 */
function lastSector() {
    return sectors.length > 0 ? sectors[sectors.length - 1] : null;
}

/**
 * Vrátí předposlední existující sektor ze seznamu sektorů.
 * @returns {unresolved} Předposlední existující sektor ze seznamu sektorů nebo null, pokud existují méně než 2 sektory.
 */
function penultimateSector() {
    return sectors.length > 1 ? sectors[sectors.length - 2] : null;
}

/**
 * Vrátí poslední měsíc předchozího sektoru.
 * @param {type} sector Zkoumaný sektor.
 * @returns {Number} Poslední měsíc předchozího sektoru nebo 0, pokud jde o první sektor.
 */
function getLastMonthOfPreviousSector(sector) {
    return sector.id <= 0 ? 0 : sectors[sector.id - 1].toMonth;
}