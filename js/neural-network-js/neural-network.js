var NeuralNetwork = {
    
    exec: function(context, matrix = [], input, hiddenColumn, hiddenRow, outputColumns, outputData) {
        var totalWeight = ((input.length * hiddenColumn) + (hiddenColumn * hiddenRow) + (hiddenRow * outputColumns));
        if(matrix.length == 0 || matrix.length != totalWeight) {
            if(context.weightSeq == null || context.weightSeq != totalWeight) {
                context.weightSeq = matrix = this.genMatrix(totalWeight);
            } else {
                matrix = context.weightSeq;
            }
        }
        var index = 0;
        var indexNeurons = 0;
        var neurons = [];
        var output = [];
        for(var column = 0; column < hiddenColumn; column++) {
            if(column == 0) {
                for(var row in input) {
                    for(var rowInternal = 0; rowInternal < hiddenRow; rowInternal++) {
                        var totalData = input[row] * matrix[index];
                        neurons[index] = (totalData < 1 ? 0 : totalData);
                        index++;
                    }
                }
            } else if (column == (hiddenColumn - 1)) {
                for(var rowInternal = 0; rowInternal < hiddenRow; rowInternal++) {
                    for (var c = 0; c < outputColumns; c++) {
                        totalData = neurons[indexNeurons] * matrix[index];
                        output.push(totalData > 0 ? 1 : 0);
                        indexNeurons++;
                        index++;
                    }
                }
            } else {
                for(var row = 0; row < hiddenRow; row++) {
                    for(var rowInternal = 0; rowInternal < hiddenRow; rowInternal++) {
                        totalData = neurons[indexNeurons] * matrix[index];
                        neurons[index] = (totalData < 1 ? 0 : totalData);
                        indexNeurons++;
                        index++;
                    }
                }    
            }
        }
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