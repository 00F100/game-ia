var NeuralNetwork = {
    exec: function(input, hiddenColumn, hiddenRow, outputColumn, outputData) {
        console.log('neural network');
        console.log([input, hiddenColumn, hiddenRow, outputColumn, outputData]);
        outputData([1, 2, 3, 4, 5]);
    }
};