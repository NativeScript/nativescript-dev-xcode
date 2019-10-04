var DEFAULT_SOURCETREE = '"<group>"',
    DEFAULT_PRODUCT_SOURCETREE = 'BUILT_PRODUCTS_DIR',
    DEFAULT_FILEENCODING = 4,
    DEFAULT_GROUP = 'Resources',
    DEFAULT_FILETYPE = 'unknown',
    HEADER_FILE_TYPE_SUFFIX = ".h",
    ENTITLEMENTS_FILE_TYPE_SUFFIX = ".entitlements",
    SOURCE_CODE_FILE_TYPE_PREFIX = "sourcecode.";

var FILETYPE_BY_EXTENSION = {
        a: 'archive.ar',
        app: 'wrapper.application',
        appex: 'wrapper.app-extension',
        bundle: 'wrapper.plug-in',
        c: 'sourcecode.c.c',
        cc: 'sourcecode.cpp.cpp',
        cpp: 'sourcecode.cpp.cpp',
        cxx: 'sourcecode.cpp.cpp',
        'c++': 'sourcecode.cpp.cpp',
        dylib: 'compiled.mach-o.dylib',
        framework: 'wrapper.framework',
        h: 'sourcecode.c.h',
        hh: 'sourcecode.cpp.h',
        hpp: 'sourcecode.cpp.h',
        hxx: 'sourcecode.cpp.h',
        'h++': 'sourcecode.cpp.h',
        m: 'sourcecode.c.objc',
        mm: 'sourcecode.cpp.objcpp',
        markdown: 'text',
        mdimporter: 'wrapper.cfbundle',
        octest: 'wrapper.cfbundle',
        pch: 'sourcecode.c.h',
        plist: 'text.plist.xml',
        entitlements: 'text.plist.entitlements',
        png: "image.png",
        sh: 'text.script.sh',
        swift: 'sourcecode.swift',
        tbd: 'sourcecode.text-based-dylib-definition',
        xcassets: 'folder.assetcatalog',
        xcconfig: 'text.xcconfig',
        xcdatamodel: 'wrapper.xcdatamodel',
        xcodeproj: 'wrapper.pb-project',
        xctest: 'wrapper.cfbundle',
        xib: 'file.xib',
        strings: 'text.plist.strings',
        modulemap: 'sourcecode.module-map'
    },
    GROUP_BY_FILETYPE = {
        'archive.ar': 'Frameworks',
        'compiled.mach-o.dylib': 'Frameworks',
        'sourcecode.text-based-dylib-definition': 'Frameworks',
        'wrapper.framework': 'Frameworks',
        'embedded.framework': 'Embed Frameworks',
        'sourcecode.c.h': 'Resources',
        'sourcecode.c.c': 'Sources',
        'sourcecode.c.objc': 'Sources',
        'sourcecode.swift': 'Sources',
        'sourcecode.cpp.cpp': 'Sources',
        'sourcecode.cpp.objcpp': 'Sources'
    },
    PATH_BY_FILETYPE = {
        'compiled.mach-o.dylib': 'usr/lib/',
        'sourcecode.text-based-dylib-definition': 'usr/lib/',
        'wrapper.framework': 'System/Library/Frameworks/'
    },
    SOURCETREE_BY_FILETYPE = {
        'compiled.mach-o.dylib': 'SDKROOT',
        'sourcecode.text-based-dylib-definition': 'SDKROOT',
        'wrapper.framework': 'SDKROOT'
    },
    ENCODING_BY_FILETYPE = {
        'sourcecode.c.h': 4,
        'sourcecode.c.h': 4,
        'sourcecode.cpp.h': 4,
        'sourcecode.c.c': 4,
        'sourcecode.c.objc': 4,
        'sourcecode.cpp.cpp': 4,
        'sourcecode.cpp.objcpp': 4,
        'sourcecode.swift': 4,
        'text': 4,
        'text.plist.xml': 4,
        'text.script.sh': 4,
        'text.xcconfig': 4,
        'text.plist.strings': 4
    };

function isHeaderFileType(fileType) {
    return fileType.endsWith(HEADER_FILE_TYPE_SUFFIX);
}

function isSourceFileType(fileType) {
    return fileType.startsWith(SOURCE_CODE_FILE_TYPE_PREFIX) && !isHeaderFileType(fileType);
}

function isAssetFileType(fileType) {
    return fileType === FILETYPE_BY_EXTENSION.xcassets;
}

function isResource(group) {
    return group === "Resources";
}

function isEntitlementFileType(fileType) {
    return fileType.endsWith(ENTITLEMENTS_FILE_TYPE_SUFFIX);
}

function isPlistFileType(fileType) {
    return fileType === FILETYPE_BY_EXTENSION.plist;
}

function unquoted(text) {
    return text == null ? '' : text.replace (/(^")|("$)/g, '')
}

function quoteIfNeeded(name) {
    const quotedName = (name.indexOf(" ") >= 0 || name.indexOf("@") >= 0) && name[0] !== `"` ? `"${name}"` : name;
    return quotedName;
}

function isModuleMapFileType(fileType) {
    return fileType === FILETYPE_BY_EXTENSION.modulemap;
}

module.exports = {
    DEFAULT_SOURCETREE,
    DEFAULT_PRODUCT_SOURCETREE,
    DEFAULT_FILEENCODING,
    DEFAULT_GROUP,
    DEFAULT_FILETYPE,
    HEADER_FILE_TYPE_SUFFIX,
    ENTITLEMENTS_FILE_TYPE_SUFFIX,
    SOURCE_CODE_FILE_TYPE_PREFIX,
    FILETYPE_BY_EXTENSION,
    GROUP_BY_FILETYPE,
    PATH_BY_FILETYPE,
    SOURCETREE_BY_FILETYPE,
    ENCODING_BY_FILETYPE,
    isHeaderFileType,
    isSourceFileType,
    isAssetFileType,
    isResource,
    isEntitlementFileType,
    isPlistFileType,
    isModuleMapFileType,
    unquoted,
    quoteIfNeeded
}