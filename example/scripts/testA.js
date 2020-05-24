let resultC = require("./testC.js");
let resultB = require("./test_folder/testB.js");
"SEPARATE";

console.log("Execute A.");
console.log("A:", resultB);
console.log("A:", resultC);

module.exports = {
    result: "Result A",
};