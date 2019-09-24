var NeuralNetwork = {
    
    exec: function(context, matrix = [], input, hiddenColumn, hiddenRow, outputColumns, outputData) {
        var value = 0;
        for(var i = 0; i < hiddenColumn; i++) {
            value = value + (hiddenRow * outputColumns);
        }
        var totalWeight = (input.length * hiddenColumn) + value + (hiddenRow * outputColumns);
        if(matrix.length == 0 || matrix.length != totalWeight) {
            if(context.weightSeq == null || context.weightSeq != totalWeight) {
                context.weightSeq = matrix = this.genMatrix(totalWeight);
            } else {
                matrix = context.weightSeq;
            }
        }
        var index = 0;
        var neurons = [];
        var output = [];
        for(var column = 0; column < hiddenColumn; column++) {
            if(column == 0) {
                for(var row in input) {
                    var neuroCount = 0;
                    for(var rowInternal = 0; rowInternal < hiddenRow; rowInternal++) {
                        neurons[neuroCount] = (input[row] * matrix[index]) + (neurons[neuroCount] != undefined ? neurons[neuroCount] : 0);
                        neuroCount++;
                        index++;
                    }
                }
                neuroCount = 0;
                for(var rowInternal = 0; rowInternal < hiddenRow; rowInternal++) {
                    if(neurons[neuroCount] <= 0) {
                        neurons[neuroCount] = 0;
                    }
                    neuroCount++;
                }
            } else if (column == (hiddenColumn-1)) {
                var neuroCountBefore = neurons.length;
                for (var c = 0; c < outputColumns; c++) {
                    var totalValue = 0;
                    var columnCalc = (column - 1);
                    var indexNeurons = ((columnCalc < 1 ? 0 : columnCalc) * hiddenRow);
                    var neuroCount = neuroCountBefore;
                    for(var rowInternal = 0; rowInternal < hiddenRow; rowInternal++) {
                        neurons[neuroCount] = neurons[indexNeurons] * matrix[index];
                        totalValue = totalValue + neurons[indexNeurons] * matrix[index];
                        indexNeurons++;
                        neuroCount++;
                        index++;
                    }
                    output.push(totalValue <= 0 ? 0 : 1);
                }
                neuroCount = neuroCountBefore;
                for(var rowInternal = 0; rowInternal < hiddenRow; rowInternal++) {
                    if(neurons[neuroCount] <= 0) {
                        neurons[neuroCount] = 0;
                    }
                    neuroCount++;
                }
            } else {
                var neuroCountBefore = neurons.length;
                for(var row = 0; row < hiddenRow; row++) {
                    var columnCalc = (column - 1);
                    var indexNeurons = ((columnCalc < 1 ? 0 : columnCalc) * hiddenRow);
                    var neuroCount = neuroCountBefore;
                    for(var rowInternal = 0; rowInternal < hiddenRow; rowInternal++) {
                        var totalData = neurons[indexNeurons] * matrix[index];
                        neurons[neuroCount] = (neurons[indexNeurons] * matrix[index]) + (neurons[neuroCount] != undefined ? neurons[neuroCount] : 0);
                        indexNeurons++;
                        neuroCount++;
                        index++;
                    }
                }
                neuroCount = neuroCountBefore;
                for(var rowInternal = 0; rowInternal < hiddenRow; rowInternal++) {
                    if(neurons[neuroCount] <= 0) {
                        neurons[neuroCount] = 0;
                    }
                    neuroCount++;
                }
            }
        }
        console.log(index);
        outputData(output);
    },

    genMatrix: function(totalWeight) {
        var items = [];
        for(var i = 0; i < totalWeight; i++) {
            items.push(me.Math.random(0, 1000) * (me.Math.random(1,4) == 1 ? -1 : 1));
        }
        return items;
    }
};