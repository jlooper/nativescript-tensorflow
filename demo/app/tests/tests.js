var Tensorflow = require("nativescript-tensorflow").Tensorflow;
var tensorflow = new Tensorflow();

describe("greet function", function() {
    it("exists", function() {
        expect(tensorflow.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(tensorflow.greet()).toEqual("Hello, NS");
    });
});