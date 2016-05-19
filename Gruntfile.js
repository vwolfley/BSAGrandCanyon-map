module.exports = function(grunt) {

    "use strict";

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        bannercss: '/*!\n' +
            ' * @concat.min.css\n' +
            ' * @CSS document for GCC District Map Viewer @ MAG\n' +
            ' * @For Production\n' +
            ' * @<%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %>\n' +
            ' * @author <%= pkg.author %>\n' +
            '*/\n',

        bannercss: '/*! ========================================================================\n' +
            ' * Maricopa Association of Governments\n' +
            ' * CSS files for MAG Main Map Page\n' +
            ' * concat.min.css | version | <%= pkg.version %>\n' +
            ' * Production | <%= pkg.date %> | http://ims.azmag.gov/\n' +
            ' * MAG Main Map Page\n' +
            ' * ==========================================================================\n' +
            ' * Copyright 2016 MAG\n' +
            ' * Licensed under MIT\n' +
            ' * ========================================================================== */\n',

            bannerjs:   '/*! ========================================================================\n' +
                    ' * Maricopa Association of Governments\n' +
                    ' * JavaScript files for MAG Main Map Page\n' +
                    ' * main.min.js | version | <%= pkg.version %>\n' +
                    ' * Production | <%= pkg.date %> | http://ims.azmag.gov/\n' +
                    ' * MAG Main Map Page\n' +
                    ' * ==========================================================================\n' +
                    ' * Copyright 2016 MAG\n' +
                    ' * Licensed under MIT\n' +
                    ' * ========================================================================== */\n',

        htmlhint: {
            build: {
                options: {
                    "tag-pair": true, // Force tags to have a closing pair
                    "tagname-lowercase": true, // Force tags to be lowercase
                    "attr-lowercase": true, // Force attribute names to be lowercase e.g. <div id="header"> is invalid
                    "attr-value-double-quotes": true, // Force attributes to have double quotes rather than single
                    // "doctype-first": true,           // Force the DOCTYPE declaration to come first in the document
                    "spec-char-escape": true, // Force special characters to be escaped
                    "id-unique": true, // Prevent using the same ID multiple times in a document
                    // "head-script-disabled": false,   // Prevent script tags being loaded in the head for performance reasons
                    "style-disabled": true // Prevent style tags. CSS should be loaded through
                },
                src: ["index.html", "app/views/*.html"]
            }
        },

        jshint: {
            files: ["js/*.js"],
            options: {
                // strict: true,
                sub: true,
                quotmark: "double",
                trailing: true,
                curly: true,
                eqeqeq: true,
                unused: true,
                scripturl: true, // This option defines globals exposed by the Dojo Toolkit.
                dojo: true, // This option defines globals exposed by the jQuery JavaScript library.
                jquery: true, // Set force to true to report JSHint errors but not fail the task.
                force: true,
                reporter: require("jshint-stylish-ex")
            }
        },

        uglify: {
            options: {
                // add banner to top of output file
                banner: '/*! main.js | <%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %> */\n'
            },
            build: {
                files: {
                    // config files
                    "../deploy/build.min/app/config/cbrConfig.js": ["app/config/cbrConfig.js"],
                    "../deploy/build.min/app/config/colorRampConfig.js": ["app/config/colorRampConfig.js"],
                }
            }
        },

        cssmin: {
            add_banner: {
                options: {
                    // add banner to top of output file
                    banner: '/* <%= pkg.name %> - v<%= pkg.version %> | <%= grunt.template.today("mm-dd-yyyy") %> */'
                },
                files: {
                    "app/resources/css/main.min.css": ["app/resources/css/main.css"],
                    "app/resources/css/normalize.min.css": ["app/resources/css/normalize.css"]
                }
            }
        },

        concat: {
            options: {
                stripBanners: true,
                banner: '<%= bannercss %>\n'
            },
            dist: {
                src: ["app/resources/css/normalize.min.css", "app/resources/css/main.min.css"],
                dest: "app/resources/css/concat.min.css"
            }
        },

        watch: {
            html: {
                files: ["index.html", "about.html", "contact.html"],
                tasks: ["htmlhint"]
            },
            css: {
                files: ["css/main.css"],
                tasks: ["csslint"]
            },
            js: {
                files: ["js/main.js"],
                tasks: ["jshint"]
            }
        },

        versioncheck: {
            options: {
                skip: ["semver", "npm", "lodash"],
                hideUpToDate: false
            }
        },

         replace: {
            update_Meta: {
                src: ["index.html", "about.html", "contact.html", "details.html", "js/main.js", "humans.txt", "README.md", "css/main.css"], // source files array
                // src: ["README.md"], // source files array
                overwrite: true, // overwrite matched source files
                replacements: [{
                    // html pages
                    from: /(<meta name="revision-date" content=")[0-9]{2}\/[0-9]{2}\/[0-9]{4}(">)/g,
                    to: '<meta name="revision-date" content="' + '<%= pkg.date %>' + '">',
                }, {
                    // html pages
                    from: /(<meta name="version" content=")([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))(">)/g,
                    to: '<meta name="version" content="' + '<%= pkg.version %>' + '">',
                }, {
                    // main.js
                    from: /(MAG main.js)( \| )(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "MAG main.js | v" + '<%= pkg.version %>',
                }, {
                    // main.js
                    from: /(v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( \| )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: 'v' + '<%= pkg.version %>' + ' | ' + '<%= pkg.date %>',
                }, {
                    // humans.txt
                    from: /(Version\: v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "Version: v" + '<%= pkg.version %>',
                }, {
                    // humans.txt
                    from: /(Last updated\: )[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g,
                    to: "Last updated: " + '<%= pkg.date %>',
                }, {
                    // README.md
                    from: /(#### `v)([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))( - )[0-9]{2}\/[0-9]{2}\/[0-9]{4}(`)/g,
                    to: "#### `v" + '<%= pkg.version %>' + ' - ' + '<%= pkg.date %>' + '`',
                }, {
                    // main.css
                    from: /(main.css)( \| )(version)( \| )([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/g,
                    to: "main.css | version |" +' <%= pkg.version %>',
                }]
            }
        }


    });

    // this would be run by typing "grunt test" on the command line
    // grunt.registerTask("test", ["uglify", "cssmin", "concat"]);

    grunt.registerTask("check", ["versioncheck"]);

    grunt.registerTask("update", ["replace"]);

    grunt.registerTask("work", ["jshint"]);

    grunt.registerTask("buildcss", ["cssmin", "concat"]);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/