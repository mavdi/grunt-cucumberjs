'use strict';
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;
var config = require('../config/config.json');

module.exports = {

    assert: function(htmlFile) {
        var jsonFile = htmlFile + '.json';

        function assertJsonContents() {
            var jsonOutput = require('../../' + jsonFile);
            var jsonOutputStringify = JSON.stringify(jsonOutput);


            //verify number of scenarios
            var numberOfScenarios = 0;
            jsonOutput.forEach(function(feature) {
                numberOfScenarios += feature.elements.length;
            });

            expect(numberOfScenarios).to.be.equal(config.scenario.totalScenarios, 'Scenarios are missing in the report');

            //verify screenshot is attached to the report
            expect(jsonOutputStringify).to.contain('mime_type":"image/png"', 'screenshot was not attached to report');

            //verify test data is attached to the report
            expect(jsonOutputStringify).to.contain('mime_type":"text/plain"', 'test data was not attached to report');

            //verify data-table is attached to the report
            expect(jsonOutputStringify).to.contain('rows', 'data-table rows was not attached to report');
            expect(jsonOutputStringify).to.contain('cells', 'data-table rows was not attached to report');
        }
        
        return assertJsonContents();
    }
};