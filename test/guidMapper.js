var guidMapper = require('../lib/guidMapper');
const fs = require('fs');
const $uuid = require('uuid');
const TEST_FILE_NAME = 'test/.ns-build-pbxgroup-data.json';
const goodGUID = $uuid.v4();
const goodName = "goodName";
const badName = 'badName';
const goodPath = "goodPath";
const badPath = "badPath";
exports.setUp = function(callback) {
    if(fs.existsSync(TEST_FILE_NAME)){
        fs.rmSync(TEST_FILE_NAME);
    }
    callback();
}
exports.tearDown = function(callback) {
    if(fs.existsSync(TEST_FILE_NAME)){
        fs.rmSync(TEST_FILE_NAME);
    }
    callback();
}
function addTestData(){
    var mapper = new guidMapper(TEST_FILE_NAME);
        mapper.addEntry(goodGUID, goodPath, goodName);
        mapper.writeFileSync();
}
exports.operations = {
    'should be able to add to map': function(test) {
        var mapper = new guidMapper(TEST_FILE_NAME);
        mapper.addEntry(goodGUID, goodPath, goodName);
        mapper.writeFileSync();
        mapper = new guidMapper(TEST_FILE_NAME);
        const result = mapper.findEntryGuid(goodName, goodPath);
        
        test.ok(result === goodGUID)
        test.done();
    },
    'should not match only on name': function(test) {
        addTestData();
        var mapper = new guidMapper(TEST_FILE_NAME);
       
        const result = mapper.findEntryGuid(goodName, badPath);
        
        test.ok(result === null)
        test.done();
    },
    'should not match only on path': function(test) {
        addTestData();
        var mapper = new guidMapper(TEST_FILE_NAME);
       
        const result = mapper.findEntryGuid(badName, goodPath);
        
        test.ok(result === null)
        test.done();
    },
    'can remove': function(test) {
        addTestData();
        var mapper = new guidMapper(TEST_FILE_NAME);
        mapper.removeEntry(goodGUID);
        var result = mapper.findEntryGuid(goodName, goodPath);
        
        test.ok(result === null);
        mapper.writeFileSync();
        result = mapper.findEntryGuid(goodName, goodPath);
        test.ok(result === null)

        test.done();
    }
}