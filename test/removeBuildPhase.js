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

var fullProject = require('./fixtures/full-project')
    fullProjectStr = JSON.stringify(fullProject),
    pbx = require('../lib/pbxProject'),
    proj = new pbx('.');

function cleanHash() {
    return JSON.parse(fullProjectStr);
}

exports.setUp = function (callback) {
    proj.hash = cleanHash();
    callback();
}

exports.removeBuildPhase = {

    'should remove a pbxBuildPhase': function (test) {
        const comment = 'My build phase';
        var buildPhase = proj.addBuildPhase([], 'PBXSourcesBuildPhase', comment);
        proj.removeBuildPhase(comment)
        let phases = proj.hash.project.objects['PBXNativeTarget'][proj.getFirstTarget().uuid]['buildPhases'];

        test.ok(phases.map(p => p.comment).indexOf(comment) === -1);
        test.done()
    },
}
