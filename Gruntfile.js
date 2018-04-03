/* global module */
/* global require */

var config = require('./gruntConfig.json');
var manifest = require('./webapp/manifest.json');

module.exports = function (grunt) {
    'use strict';
    var sapHost = config.sapHost;
    var sapPort = config.sapPort;
    var sapServer = config.sapProtocol + "://" + sapHost + ":" + sapPort;
    var sapBspContainer = config.sapBspContainer;
    var sapPackage = config.sapPackage;
    var sapTransport = config.sapTransport;

    config.sapUser = grunt.option("user");
    config.sapPassword = grunt.option("password");

    grunt.initConfig({
        dir: {
            webapp: 'webapp',
            dist: 'dist',
            bowerComponents: 'bower_components'
        },
        connect: {
            options: {
                base: 'public',
                hostname: 'localhost',
                open: true,
                livereload: true,
                middleware: function (connect, options, defaultMiddleware) {
                    var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                    return [
                        proxy
                    ].concat(defaultMiddleware);
                }
            },
            proxies: [
                {
                    context: '/sap',
                    host: sapHost,
                    port: sapPort,
                    https: false
                }
            ],
            src: {},
            dist: {}
        },
        openui5_connect: {
            options: {
                resources: [
                    '<%= dir.bowerComponents %>/openui5-sap.m/resources',
                    '<%= dir.bowerComponents %>/openui5-sap.ui.core/resources',
                    '<%= dir.bowerComponents %>/openui5-sap.ui.layout/resources',
                    '<%= dir.bowerComponents %>/openui5-sap.ui.unified/resources',
                    '<%= dir.bowerComponents %>/openui5-sap.ui.table/resources',
                    '<%= dir.bowerComponents %>/openui5-sap.uxap/resources',
                    '<%= dir.bowerComponents %>/openui5-themelib_sap_belize/resources'
                ]
            },
            src: {
                options: {
                    appresources: '<%= dir.webapp %>'
                }
            },
            dist: {
                options: {
                    appresources: '<%= dir.dist %>'
                }
            }
        },
        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: '<%= dir.webapp %>',
                        prefix: manifest['sap.app'].id.replace('.', '/')
                    },
                    dest: '<%= dir.dist %>'
                },
                components: true
            }
        },
        clean: {
            dist: '<%= dir.dist %>/'
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= dir.webapp %>',
                    src: [
                        '**',
                        '!localService/**',
                        '!test/**'
                    ],
                    dest: '<%= dir.dist %>'
                }]
            }
        },
        watch: {
            all: {
                files: 'webapp/**/*',
                options: {
                    livereload: true
                }
            },
            js: {
                files: 'webapp/**/*.js',
                tasks: ['test']
            }
        },
        eslint: {
            webapp: ['<%= dir.webapp %>'],
            options: {
                fix: true
            }
        },
        'string-replace': {
            i18n_utf8: {
                src: './node_modules/connect-openui5/lib/properties.js',
                dest: './node_modules/connect-openui5/lib/properties.js',
                options: {
                    replacements: [{
                        pattern: /ISO-8859-1/g,
                        replacement: function () {
                            return 'UTF-8';
                        }
                    }]
                }
            },
            cdn_ui5lib: {
                src: './dist/index.html',
                dest: './dist/index.html',
                options: {
                    replacements: [{
                        pattern: /src="resources\/sap-ui-core.js"/ig,
                        replacement: function () {
                            return 'src="https://openui5.hana.ondemand.com/resources/sap-ui-core.js"';
                        }
                    }]
                }
            }
        },
        nwabap_ui5uploader: {
            options: {
                conn: {
                    server: sapServer,
                    useStrictSSL: false
                },
                auth: {
                    user: config.sapUser,
                    pwd: config.sapPassword
                }
            },
            upload_build: {
                options: {
                    ui5: {
                        language: 'DE',
                        package: sapPackage,
                        bspcontainer: sapBspContainer,
                        bspcontainer_text: 'UI5 App',
                        transportno: sapTransport,
                        calc_appindex: true
                    },
                    resources: {
                        cwd: 'dist',
                        src: '**/*.*'
                    }
                }
            }
        },
        prompt: {
            deploy: {
                options: {
                    questions: [
                        {
                            config: 'nwabap_ui5uploader.options.auth.user',
                            type: 'input',
                            message: 'SAP-Username'
                        }, {
                            config: 'nwabap_ui5uploader.options.auth.pwd',
                            type: 'password',
                            message: 'SAP-Passwort'
                        }
                    ]
                }
            }
        }
    });

    // Definiere Tasks
    require('load-grunt-tasks')(grunt);

    // Linten aller Dateien
    grunt.registerTask('test', [
        'eslint'
    ]);

    // Alias für run: Serve-Task starten und beobachten für Live-Änderungen
    grunt.registerTask('build', [
        'run'
    ]);

    // In Dist-Ordner kompilieren und Component-preload erstellen
    grunt.registerTask('dist', function(target) {
        grunt.task.run('test');
        grunt.task.run('clean');
        grunt.task.run('openui5_preload');
        grunt.task.run('copy');   
        grunt.task.run('string-replace:cdn_ui5lib');
        
    });

    // Serve-Task starten und beobachten für Live-Änderungen
    grunt.registerTask('run', function (target) {
        grunt.task.run('configureProxies');
        grunt.task.run('string-replace:i18n_utf8');
        grunt.task.run('openui5_connect:' + (target || 'src'));
        grunt.task.run('watch');
    });

    // Deployment ins SAP-System
    grunt.registerTask('deploy', function() {
        if (!config.sapUser || !config.sapPassword) {
            grunt.task.run('prompt:deploy');
        }
        grunt.task.run('nwabap_ui5uploader');
    });

    // Default: Build + Run
    grunt.registerTask('default', [
        'dist',
        'run:dist'
    ]);

};