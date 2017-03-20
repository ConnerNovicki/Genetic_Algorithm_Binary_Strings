var Individual = function(binaryStringLength) {
    this.binaryString = "";
    this.fitness = 0;
}

Individual.prototype.generateRandomString = function(binaryStringLength) {
    for (var i = 0; i < binaryStringLength; i++) {
        this.binaryString += (Math.round(Math.random())).toString();
    }
}

Individual.prototype.setBinaryString = function(binaryString) {
    this.binaryString = binaryString;
}

Individual.prototype.toString = function() {
    return this.binaryString;
}

Individual.prototype.calculateFitness = function(goalBinaryString) {
    var fit = this.binaryString.length;
    for (var i = 0; i < goalBinaryString.length; i++) {
        if (this.binaryString.charAt(i) == goalBinaryString.charAt(i)) {
            fit -= 1;
        }
    }
    this.fitness = fit;
}

Individual.prototype.bitAt = function(index) {
    return this.binaryString.charAt(index);
}

Individual.prototype.switchBit = function(bit) {
    if (this.binaryString.charAt(bit) == '0') {
        this.binaryString = this.binaryString.substring(0, bit) + '1' + this.binaryString.substring(bit+1);
    } else {
        this.binaryString = this.binaryString.substring(0, bit) + '0' + this.binaryString.substring(bit+1);
    }
}
