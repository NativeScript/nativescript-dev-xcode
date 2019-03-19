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

var path = require('path'),
    util = require('util'),
    constants = require('./constants'),
    unquoted = constants.unquoted,
    FILETYPE_BY_EXTENSION = constants.FILETYPE_BY_EXTENSION;

function detectType(filePath) {
    var extension = path.extname(filePath).substring(1),
        filetype = FILETYPE_BY_EXTENSION[unquoted(extension)];

    if (!filetype) {
        return constants.DEFAULT_FILETYPE;
    }

    return filetype;
}

function defaultExtension(fileRef) {
    var filetype = fileRef.lastKnownFileType && fileRef.lastKnownFileType != constants.DEFAULT_FILETYPE ?
        fileRef.lastKnownFileType : fileRef.explicitFileType;

    for(var extension in FILETYPE_BY_EXTENSION) {
        if(FILETYPE_BY_EXTENSION.hasOwnProperty(unquoted(extension)) ) {
             if(FILETYPE_BY_EXTENSION[unquoted(extension)] === unquoted(filetype) )
                 return extension;
        }
    }
}

function defaultEncoding(fileRef) {
    var filetype = fileRef.lastKnownFileType || fileRef.explicitFileType,
        encoding = constants.ENCODING_BY_FILETYPE[unquoted(filetype)];

    if (encoding) {
        return encoding;
    }
}

function detectGroup(fileRef, opt) {
    var extension = path.extname(fileRef.basename).substring(1),
        filetype = fileRef.lastKnownFileType || fileRef.explicitFileType,
        groupName = constants.GROUP_BY_FILETYPE[unquoted(filetype)];

    if (extension === 'xcdatamodeld') {
        return 'Sources';
    }

    if (opt.customFramework && opt.embed) {
        return constants.GROUP_BY_FILETYPE['embedded.framework'];
    }

    if (!groupName) {
        return constants.DEFAULT_GROUP;
    }

    return groupName;
}

function detectSourcetree(fileRef) {

    var filetype = fileRef.lastKnownFileType || fileRef.explicitFileType,
        sourcetree = constants.SOURCETREE_BY_FILETYPE[unquoted(filetype)];

    if (fileRef.explicitFileType) {
        return constants.DEFAULT_PRODUCT_SOURCETREE;
    }

    if (fileRef.customFramework) {
        return constants.DEFAULT_SOURCETREE;
    }

    if (!sourcetree) {
        return constants.DEFAULT_SOURCETREE;
    }

    return sourcetree;
}

function defaultPath(fileRef, filePath) {
    var filetype = fileRef.lastKnownFileType || fileRef.explicitFileType,
        defaultPath = constants.PATH_BY_FILETYPE[unquoted(filetype)];

    if (fileRef.customFramework) {
        return filePath;
    }

    if (defaultPath) {
        return path.join(defaultPath, path.basename(filePath));
    }

    return filePath;
}

function pbxFile(filepath, opt) {
    opt = opt || {};

    this.basename = opt.basename || path.basename(filepath);
    this.lastKnownFileType = opt.lastKnownFileType || detectType(filepath);
    this.group = detectGroup(this, opt);

    // for custom frameworks
    if (opt.customFramework == true) {
        this.customFramework = true;
        this.dirname = path.dirname(filepath).replace(/\\/g, '/');
    }

    this.path = defaultPath(this, filepath).replace(/\\/g, '/');
    this.fileEncoding = this.defaultEncoding = opt.defaultEncoding || defaultEncoding(this);

    // When referencing products / build output files
    if (opt.explicitFileType) {
        this.explicitFileType = opt.explicitFileType;
        this.basename = this.basename + '.' + defaultExtension(this);
        delete this.path;
        delete this.lastKnownFileType;
        delete this.group;
        delete this.defaultEncoding;
    }

    this.sourceTree = opt.sourceTree || detectSourcetree(this);
    this.includeInIndex = 0;

    if (opt.weak && opt.weak === true)
        this.settings = { ATTRIBUTES: ['Weak'] };

    if (opt.compilerFlags) {
        if (!this.settings)
            this.settings = {};
        this.settings.COMPILER_FLAGS = util.format('"%s"', opt.compilerFlags);
    }

    if (opt.embed && opt.sign) {
      if (!this.settings)
          this.settings = {};
      if (!this.settings.ATTRIBUTES)
          this.settings.ATTRIBUTES = [];
      this.settings.ATTRIBUTES.push('CodeSignOnCopy');
    }
}

module.exports = pbxFile;