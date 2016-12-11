"use strict";
/* global describe, it */
var fs = require("fs");
var assert = require("assert");

var postcss = require("postcss");
var postcss_pie = require("..");

// Helper function to perform processing on text
function performCssPIEProcessing(cssText, postcssOpts, cssPIEOptions) {
	return postcss([ postcss_pie(cssPIEOptions) ])
			.process(cssText, postcssOpts).css;
}
function getCssPIEOptions(test) {
	// regular behaviour application
	if(test.indexOf('behavior') !== -1) {
		return {
			htcPath: "/PIE/build/PIE.htc",
			pieLoadPath: "http://css3pie.com/pie",
		};
	}
	// border-box enhancement
	else if(test.indexOf('box') !== -1) {
		return {
			boxSizingPath: "/box-sizing/boxsizing.htc"
		};
	}
	return undefined;
}

// Perform an initial process just to ensure that the processing is working
performCssPIEProcessing(".test-opts{}", undefined, {
	htcPath: "PIE.htc",
	pieLoadPath: "https://github.com/pie",
});


var files = (function readOnlyCssFilesFrom(directory){ 

			return 	fs.readdirSync(directory)
					.filter(filename => { return /\.css$/.test(filename) // ends with css
										 && !/-out\.css$/.test(filename); // contains output pattern
							})
			})("./test/fixtures");

describe("postcss-pie", function() {

	var noFailingTests = true;

	files.forEach(filename => {

		// name the files according to the test
		var testName = filename.replace(/\.\w+$/, ""),
			pathToFile = "./test/fixtures/" + filename;

		var inputCSS = fs.readFileSync(pathToFile).toString(),
			expectedOutput = "";

		try { // read text
			expectedOutput = fs.readFileSync("./test/fixtures/out/" + testName + "-out.css").toString();
		} catch (ex) {
			console.error(ex);
		}

		var postProcessedText = performCssPIEProcessing(inputCSS,
														{ form: pathToFile },
														getCssPIEOptions(testName)
													);

		// only perform assertion if no previous failures
		if (noFailingTests) {

			it("should be able to " + testName.replace(/-/g, " "),
				() => { assert.equal(expectedOutput, postProcessedText) });

			if(expectedOutput === inputCSS) { // show failure info if processing fails to happen
				it("should post-process " + pathToFile,
					() => { assert.notEqual(expectedOutput, inputCSS); });
			}
		}

		if (postProcessedText !== expectedOutput) {
			noFailingTests = false;

			// uncomment to suggest output
			// fs.writeFileSync("./test/fixtures/" + testName + "-out.css", real);
		}
	});
});
