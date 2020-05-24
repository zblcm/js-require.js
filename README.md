# require.js

##### require.js let you call require() in web browser like in node.js.
You import the script in the html file, then provide a read_file function, a separator and call start_with with your entry script.
```
<script type="text/javascript" src="scripts/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="../require.js"></script>
<script>
    Require.set_read_file(function(path, callback) {
        let splits = path.split("/");
        splits.shift();
        let real_path = ["http://localhost/example/scripts"].concat(splits).join("/");
        $.ajax({ url: real_path, success: callback, dataType: "text" });
    });
    Require.set_separator("SEPARATE");
    Require.start_with("./testA.js", function(result) {
        console.log("Index:", result);
    });
</script>
```
All of other requires need to be in your entry script. It is `./testA.js` in the example above.
<br />In each required script, all require calls and other statements need to be separated by a separator provided by you.
```
// testA.js
let resultC = require("./testC.js");
let resultB = require("./test_folder/testB.js");
"SEPARATE";

console.log("Execute A.");
console.log("A:", resultB);
console.log("A:", resultC);

module.exports = {
    result: "Result A",
};
```
The separator is `"SEPARATE";` in the example above. See example for more details.

## Limitations:
###### - No cycles in dependency graph.
I resolve dependency in topology order such that the require will never complete if you have cycles in dependency. Normally, you do not do this even if you are in nodejs.
###### - All of the require statement need to be in the start of the script, separated with other statements with a separator provided by you.
You cannot require script in the middle of your script.
###### - Hard to debug.
The stack trace gets long after several require calls.

See example for detail. You need to setup a local server to provide local resources in the example.
