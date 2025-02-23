/**
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 'License'); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

var pbx = require('../lib/pbxProject'),
    buildConfig = require('./fixtures/buildFiles'),
    jsonProject = require('./fixtures/full-project'),
    fullProjectStr = JSON.stringify(jsonProject),
    fs = require('fs'),
    project;

    function getCleanHash() {
        return JSON.parse(fullProjectStr);
    }

exports['creation'] = {
    'should create a pbxProject with the new operator': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        test.ok(myProj instanceof pbx);
        test.done();
    },
    'should create a pbxProject without the new operator': function (test) {
        var myProj = pbx('test/parser/projects/hash.pbxproj');

        test.ok(myProj instanceof pbx);
        test.done();
    }
}

exports['parseSync function'] = {
  'should return the hash object': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj')
          , projHash = myProj.parseSync();
        test.ok(projHash);
        test.done();
  },
  'should contain valid data in the returned objects hash': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj')
          , projHash = myProj.parseSync();
        test.ok(projHash);

        test.equal(projHash.hash.project.archiveVersion, 1);
        test.equal(projHash.hash.project.objectVersion, 45);
        test.equal(projHash.hash.project.nonObject, '29B97313FDCFA39411CA2CEF');

        test.done();
  },
}

exports['parse function'] = {
    'should emit an "end" event': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        myProj.parse().on('end', function (err, projHash) {
            test.done();
        })
    },
    'should take the end callback as a parameter': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        myProj.parse(function (err, projHash) {
            test.done();
        })
    },
    'should allow evented error handling': function (test) {
        var myProj = new pbx('NotARealPath.pbxproj');

        myProj.parse().on('error', function (err) {
            test.equal(typeof err, "object");
            test.done();
        })
    },
    'should pass the hash object to the callback function': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        myProj.parse(function (err, projHash) {
            test.ok(projHash);
            test.done();
        })
    },
    'should handle projects with comments in the header': function (test) {
        var myProj = new pbx('test/parser/projects/comments.pbxproj');

        myProj.parse(function (err, projHash) {
            test.ok(projHash);
            test.done();
        })
    },
    'should attach the hash object to the pbx object': function (test) {
        var myProj = new pbx('test/parser/projects/hash.pbxproj');

        myProj.parse(function (err, projHash) {
            test.ok(myProj.hash);
            test.done();
        })
    },
    'it should pass an error object back when the parsing fails': function (test) {
        var myProj = new pbx('test/parser/projects/fail.pbxproj');

        myProj.parse(function (err, projHash) {
            test.ok(err);
            test.done();
        })
    }
}

exports['allUuids function'] = {
   'should return the right amount of uuids': function (test) {
       var project = new pbx('.'),
           uuids;

       project.hash = buildConfig;
       uuids = project.allUuids();

       test.equal(uuids.length, 4);
       test.done();
   }
}

exports['generateUuid function'] = {
    'should return a 24 character string': function (test) {
       var project = new pbx('.'),
           newUUID;

       project.hash = buildConfig;
       newUUID = project.generateUuid();

       test.equal(newUUID.length, 24);
       test.done();
    },
    'should be an uppercase hex string': function (test) {
       var project = new pbx('.'),
           uHex = /^[A-F0-9]{24}$/,
           newUUID;

       project.hash = buildConfig;
       newUUID = project.generateUuid();

       test.ok(uHex.test(newUUID));
       test.done();
    }
}

var bcpbx = 'test/parser/projects/build-config.pbxproj';
var original_pbx = fs.readFileSync(bcpbx, 'utf-8');

exports['updateProductName function'] = {
    setUp:function(callback) {
        callback();
    },
    tearDown:function(callback) {
        fs.writeFileSync(bcpbx, original_pbx, 'utf-8');
        callback();
    },
    'should change the PRODUCT_NAME field in the .pbxproj file': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.updateProductName('furious anger');
            var newContents = myProj.writeSync();
            test.ok(newContents.match(/PRODUCT_NAME\s*=\s*"furious anger"/));
            test.done();
        });
    }
}

exports['updateBuildProperty function'] = {
    setUp:function(callback) {
        callback();
    },
    tearDown:function(callback) {
        fs.writeFileSync(bcpbx, original_pbx, 'utf-8');
        callback();
    },
    'should change build properties in the .pbxproj file': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.updateBuildProperty('TARGETED_DEVICE_FAMILY', '"arm"');
            var newContents = myProj.writeSync();
            test.ok(newContents.match(/TARGETED_DEVICE_FAMILY\s*=\s*"arm"/));
            myProj.updateBuildProperty('OTHER_LDFLAGS', ['T','E','S','T']);
            newContents = myProj.writeSync();
            test.ok(newContents.match(/OTHER_LDFLAGS\s*=\s*\(\s*T,\s*E,\s*S,\s*T,\s*\)/))
            test.done();
        });
    }
}

exports['addBuildProperty function'] = {
    setUp:function(callback) {
        callback();
    },
    tearDown:function(callback) {
        fs.writeFileSync(bcpbx, original_pbx, 'utf-8');
        callback();
    },
    'should add 4 build properties in the .pbxproj file': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.addBuildProperty('ENABLE_BITCODE', 'NO');
            var newContents = myProj.writeSync();
            test.equal(newContents.match(/ENABLE_BITCODE\s*=\s*NO/g).length, 4);
            test.done();
        });
    },
    'should add 2 build properties in the .pbxproj file for specific build': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.addBuildProperty('ENABLE_BITCODE', 'NO', 'Release');
            var newContents = myProj.writeSync();
            test.equal(newContents.match(/ENABLE_BITCODE\s*=\s*NO/g).length, 2);
            test.done();
        });
    },
    'should not add build properties in the .pbxproj file for nonexist build': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.addBuildProperty('ENABLE_BITCODE', 'NO', 'nonexist');
            var newContents = myProj.writeSync();
            test.ok(!newContents.match(/ENABLE_BITCODE\s*=\s*NO/g));
            test.done();
        });
    }
}

exports['removeBuildProperty function'] = {
    setUp:function(callback) {
        callback();
    },
    tearDown:function(callback) {
        fs.writeFileSync(bcpbx, original_pbx, 'utf-8');
        callback();
    },
    'should remove all build properties in the .pbxproj file': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.removeBuildProperty('IPHONEOS_DEPLOYMENT_TARGET');
            var newContents = myProj.writeSync();
            test.ok(!newContents.match(/IPHONEOS_DEPLOYMENT_TARGET/));
            test.done();
        });
    },
    'should remove specific build properties in the .pbxproj file': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.removeBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', 'Debug');
            var newContents = myProj.writeSync();
            test.equal(newContents.match(/IPHONEOS_DEPLOYMENT_TARGET/g).length, 2);
            test.done();
        });
    },
    'should not remove any build properties in the .pbxproj file': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.removeBuildProperty('IPHONEOS_DEPLOYMENT_TARGET', 'notexist');
            var newContents = myProj.writeSync();
            test.equal(newContents.match(/IPHONEOS_DEPLOYMENT_TARGET/g).length, 4);
            test.done();
        });
    },
    'should fine with remove inexist build properties in the .pbxproj file': function (test) {
        var myProj = new pbx('test/parser/projects/build-config.pbxproj');
        myProj.parse(function(err, hash) {
            myProj.removeBuildProperty('ENABLE_BITCODE');
            var newContents = myProj.writeSync();
            test.ok(!newContents.match(/ENABLE_BITCODE/));
            test.done();
        });
    }

}

exports['productName field'] = {
    'should return the product name': function (test) {
        var newProj = new pbx('.');
        newProj.hash = jsonProject;

        test.equal(newProj.productName, 'KitchenSinktablet');
        test.done();
    }
}

exports['addPluginFile function'] = {
    'should strip the Plugin path prefix': function (test) {
        var myProj = new pbx('test/parser/projects/full.pbxproj');

        myProj.parse(function (err, hash) {
            test.equal(myProj.addPluginFile('Plugins/testMac.m').path, 'testMac.m');
            test.equal(myProj.addPluginFile('Plugins\\testWin.m').path, 'testWin.m');
            test.done();
        });
    },
    'should add files to the .pbxproj file using the / path seperator': function (test) {
        var myProj = new pbx('test/parser/projects/full.pbxproj');

        myProj.parse(function (err, hash) {
            var file = myProj.addPluginFile('myPlugin\\newFile.m');

            test.equal(myProj.pbxFileReferenceSection()[file.fileRef].path, '"myPlugin/newFile.m"');
            test.done();
        });
    }
}

exports['hasFile'] = {
    'should return true if the file is in the project': function (test) {
        var newProj = new pbx('.');
        newProj.hash = jsonProject;

        //  sourceTree: '"<group>"'
        test.ok(newProj.hasFile('AppDelegate.m'))
        test.done()
    },
    'should return false if the file is not in the project': function (test) {
        var newProj = new pbx('.');
        newProj.hash = jsonProject;

        //  sourceTree: '"<group>"'
        test.ok(!newProj.hasFile('NotTheAppDelegate.m'))
        test.done()
    }
}

exports['addToPbxFileReferenceSection'] = {
    'should not quote name when no special characters present in basename': function (test) {
        var newProj = new pbx('.');
            newProj.hash = getCleanHash(),
            file = { 
                uuid: newProj.generateUuid(), 
                fileRef: newProj.generateUuid(), 
                isa: 'PBXFileReference', 
                explicitFileType: 'wrapper.application', 
                includeInIndex: 0, 
                basename: "SomeFile.m", 
                path: "SomePath.m", 
                sourceTree: 'BUILT_PRODUCTS_DIR' 
            },
            fileRefSection = newProj.pbxFileReferenceSection();

        newProj.addToPbxFileReferenceSection(file);
        test.equal(fileRefSection[file.fileRef].name, "SomeFile.m");
        test.done();
    },
    'should quote name when special characters present in basename': function (test) {
        var newProj = new pbx('.');
            newProj.hash = getCleanHash(),
            file = { 
                uuid: newProj.generateUuid(), 
                fileRef: newProj.generateUuid(), 
                isa: 'PBXFileReference', 
                explicitFileType: 'wrapper.application', 
                includeInIndex: 0, 
                basename: "Some File.m", 
                path: "SomePath.m", 
                sourceTree: 'BUILT_PRODUCTS_DIR' 
            },
            fileRefSection = newProj.pbxFileReferenceSection();

        newProj.addToPbxFileReferenceSection(file);
        test.equal(fileRefSection[file.fileRef].name, '"Some File.m"');
        test.done();
    },
    'should not quote path when no special characters present in path': function (test) {
        var newProj = new pbx('.');
            newProj.hash = getCleanHash(),
            file = { 
                uuid: newProj.generateUuid(), 
                fileRef: newProj.generateUuid(), 
                isa: 'PBXFileReference', 
                explicitFileType: 'wrapper.application', 
                includeInIndex: 0, 
                basename: "SomeFile.m", 
                path: "SomePath.m", 
                sourceTree: 'BUILT_PRODUCTS_DIR' 
            },
            fileRefSection = newProj.pbxFileReferenceSection();

        newProj.addToPbxFileReferenceSection(file);
        test.equal(fileRefSection[file.fileRef].path, "SomePath.m");
        test.done();
    },
    'should quote path when special characters present in path': function (test) {
        var newProj = new pbx('.');
            newProj.hash = getCleanHash(),
            file = { 
                uuid: newProj.generateUuid(), 
                fileRef: newProj.generateUuid(), 
                isa: 'PBXFileReference', 
                explicitFileType: 'wrapper.application', 
                includeInIndex: 0, 
                basename: "SomeFile.m", 
                path: "SomeFolder/Some Path.m", 
                sourceTree: 'BUILT_PRODUCTS_DIR' 
            },
            fileRefSection = newProj.pbxFileReferenceSection();

        newProj.addToPbxFileReferenceSection(file);
        test.equal(fileRefSection[file.fileRef].path, '"SomeFolder/Some Path.m"');
        test.done();
    },
    'should quote path and name when special characters present in path and basename': function (test) {
        var newProj = new pbx('.');
            newProj.hash = getCleanHash(),
            file = { 
                uuid: newProj.generateUuid(), 
                fileRef: newProj.generateUuid(), 
                isa: 'PBXFileReference', 
                explicitFileType: 'wrapper.application', 
                includeInIndex: 0, 
                basename: "Some File.m", 
                path: "SomeFolder/Some Path.m", 
                sourceTree: 'BUILT_PRODUCTS_DIR' 
            },
            fileRefSection = newProj.pbxFileReferenceSection();

        newProj.addToPbxFileReferenceSection(file);
        test.equal(fileRefSection[file.fileRef].name, '"Some File.m"');
        test.equal(fileRefSection[file.fileRef].path, '"SomeFolder/Some Path.m"');
        test.done();
    }
}


exports['addPbxGroup'] = {
    'should not add the same group twice': function (test) {
        var newProj = new pbx('test/parser/projects/group.pbxproj');
        newProj.parse(function (err, hash) {
            this.hash.project.objects['PBXVariantGroup']={};
            var group1 = newProj.addPbxGroup(['test/somefile'], "TestGroup", "test/somepath", null, null);
            var group2 = newProj.addPbxGroup(['test/somefile'], "TestGroup", "test/somepath", null, null);
            test.equal(newProj.getPBXGroupByKey(group1.uuid), null);
            test.equal(newProj.getPBXGroupByKey(group2.uuid).name, "TestGroup");
            test.equal(newProj.getPbxGroupTracker().getEntries().hasOwnProperty(group1.uuid), false);
            test.equal(newProj.getPbxGroupTracker().getEntries().hasOwnProperty(group2.uuid), true);           
        
        test.done();
        });
    }
}