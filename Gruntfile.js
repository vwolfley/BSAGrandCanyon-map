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


    });

    // this would be run by typing "grunt test" on the command line
    // grunt.registerTask("test", ["uglify", "cssmin", "concat"]);

    grunt.registerTask("check", ["versioncheck"]);

    grunt.registerTask("work", ["jshint"]);

    grunt.registerTask("buildcss", ["cssmin", "concat"]);

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask("default", []);

};

// ref
// http://coding.smashingmagazine.com/2013/10/29/get-up-running-grunt/
// http://csslint.net/about.html
// http://www.jshint.com/docs/options/