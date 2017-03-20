var population;
var POPULATION_SIZE = 50;
var goalBinaryString;
var numGenerations;
var running = false;
var complete = false;

var getNewBinaryString = function(len) {
    var binaryString = "";
    for (var i = 0; i < len; i++) {
        binaryString += (Math.round(Math.random())).toString();
    }
    return binaryString;
}

var getNewPopulation = function() {
    population = new Population();
    numGenerations = 0;
    goalBinaryString = getNewBinaryString(50);
    $(".infoList #goalBinaryString").text("Goal Binary String: " + goalBinaryString);
    population.generateRandomPopulation(POPULATION_SIZE, goalBinaryString);
}

var startGenetics = function() {
    if (!running) {
        getNewPopulation();
        createGeneticsTable();
        running = true;
        startLoop();
    }
    else if (complete) {
        getNewPopulation();
        complete = false;
        startLoop();
    } else {
        getNewPopulation();
    }
}

var createGeneticsTable = function() {
    var table = $("<table></table>").addClass("geneticsTable");

    for (var i = 0; i < population.size(); i++) {
        var row = $("<tr></tr>").addClass("geneticsTableRow");
        row.html(population.getIndividualAtIndex(i).toString());
        table.append(row);
    }
    $("#genetics_table").append(table);
}

var startLoop = function() {
    var timedFunc = setInterval(function() {
        population.calculateFitness(goalBinaryString);
        population.sort();
        population.allowGeneration();
        numGenerations++;
        updateGeneticsTable();
        updateAllLabels();
        if (population.hasSuccess()) {
            clearInterval(timedFunc);
            complete = true;
        }
    }, 200);

}

var updateGeneticsTable = function() {
    $(".geneticsTable tr").each(function(i) {
        $(this).html(population.getIndividualAtIndex(i).toString());
    });
}

var updateAllLabels = function() {
    $(".infoList #totalFitness").text("Total Fitness: " + population.totalFitness);
    $(".infoList #bestIndividual").text("Best Individual: " + population.getBestIndividual());
    $(".infoList #generationCount").text("Generation: " + numGenerations);
}
