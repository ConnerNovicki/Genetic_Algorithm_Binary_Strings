var Population = function() {
    this.individuals = [];
    this.populationSize = 0;
    this.goalBinaryString = "";
    this.totalFitness = 0;
    this.mutationRate = 0;
    this.matingRate = 0.5;
}

Population.prototype.generateRandomPopulation = function(popSize, goalBinaryString, mutationRate) {
    this.populationSize = popSize;
    this.goalBinaryString = goalBinaryString;
    this.mutationRate = mutationRate;

    for (var i = 0; i < this.populationSize; i++) {
        var ind = new Individual();
        ind.generateRandomString(this.goalBinaryString.length);
        this.individuals.push(ind);
    }
}

Population.prototype.size = function() {
    return this.populationSize;
}

Population.prototype.getIndividualAtIndex = function(index) {
    return this.individuals[index];
}

Population.prototype.randomize = function() {
    for (var i = 0; i < this.size(); i++) {
        var ind = new Individual();
        ind.generateRandomString(this.goalBinaryString.length);
        this.individuals[i] = ind;
    }
}

Population.prototype.calculateFitness = function(goalBinaryString) {
    var totalFit = 0;
    for (var i = 0; i < this.size(); i++) {
        var currInd = this.getIndividualAtIndex(i)
        currInd.calculateFitness(goalBinaryString);
        totalFit += currInd.fitness;
    }
    this.totalFitness = totalFit;
}

Population.prototype.getBestIndividual = function() {
    return this.getIndividualAtIndex(0);
}

Population.prototype.sort = function() {
    this.individuals.sort(function(a, b) {
        return a.fitness - b.fitness;
    });
}

Population.prototype.getHighestFitness = function() {
    return this.getIndividualAtIndex(this.size() - 1).fitness;
}

Population.prototype.allowGeneration = function() {
    var newPop = [];
    for (var i = 0; i < this.size(); i++) {
        var [p1, p2] = this.findParentsToReproduce(),
            [c1, c2] = this.getChildren(p1, p2);
        if (Math.random() < 0.5) newPop.push(c1);
        else newPop.push(c2);
    }
    this.individuals = newPop;
    this.allowMutations();
}

Population.prototype.findParentsToReproduce = function() {
    var rand1 = Math.round(Math.random() * this.totalFitness),
        rand2 = Math.round(Math.random() * this.totalFitness),
        i = 0, j = 0;

    while (rand1 > 0) {
        rand1 -= Math.max(1,(this.getHighestFitness() - this.getIndividualAtIndex(i).fitness));
        i = (i + 1) % this.size();
    }

    while (rand2 > 0) {
        rand2 -= Math.max(1, (this.getHighestFitness() - this.getIndividualAtIndex(j).fitness));
        j = (j + 1) % this.size();
    }
    return [this.getIndividualAtIndex(i), this.getIndividualAtIndex(j)];
}

Population.prototype.getChildren = function(parent1, parent2) {
    var child1 = "", child2 = "";

    for (var i = 0; i < this.goalBinaryString.length; i++) {
        if (Math.random() > this.matingRate) {
            child1 += parent1.bitAt(i);
            child2 += parent2.bitAt(i);
        } else {
            child2 += parent1.bitAt(i);
            child1 += parent2.bitAt(i);
        }
    }

    var childIndividual1 = new Individual(),
        childIndividual2 = new Individual();

    childIndividual1.setBinaryString(child1);
    childIndividual2.setBinaryString(child2);

    return [childIndividual1, childIndividual2];
}

Population.prototype.addChildrenToPopulation = function(child1, child2) {
    if (child1.fitness < child2.fitness) {
        this.individuals[this.size() - 2] = child1;
        this.individuals[this.size() - 1] = child2;
    } else {
        this.individuals[this.size() - 2] = child2;
        this.individuals[this.size() - 1] = child1;
    }
}

Population.prototype.allowMutations = function() {
    for (var i = 1; i < this.size(); i++) {
        if (Math.random() < this.mutationRate) {
            var changeBit = Math.round(Math.random() * this.goalBinaryString.length);
            this.getIndividualAtIndex(i).switchBit(changeBit);
        }
    }
}

Population.prototype.hasSuccess = function() {
    return this.getIndividualAtIndex(0).binaryString == goalBinaryString;
}
