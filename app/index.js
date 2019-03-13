'use strict';
const Generator = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

/*
 * dimensions see
 * http://www.iab-austria.at/digitale-wirtschaft/technische-spezifikationen/html-5-guideline-standards/2-1-bannerformate/
 */
var banner = {
    sitebar: {
        height: 600,
        width: 300
    },
    'halfpage-ad': {
        height: 600,
        width: 300
    },
    contentad: {
        height: 250,
        width: 300
    },
    'billboard-940': {
        height: 250,
        width: 940
    },
    'billboard-950': {
        height: 250,
        width: 950
    },
    'billboard-960': {
        height: 250,
        width: 960
    },
    'billboard-970': {
        height: 250,
        width: 970
    },
    skyscraper: {
        height: 600,
        width: 160
    },
    superbanner: {
        height: 90,
        width: 728
    }
};

module.exports = class extends Generator {
    initializing() {
        this.pkg = require('../package.json');
    }

    prompting() {
        // Have Yeoman greet the user.
        this.log(
            yosay(
                'Welcome to the ultimate ' +
                chalk.red('HTML5-Banner') +
                ' generator!'
            )
        );

        var prompts = [
            {
                type: 'input',
                name: 'bannerName',
                message: 'Insert Bannername:'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Insert Description:'
            },
            {
                type: 'checkbox',
                name: 'features',
                message: 'What features should be enabled?',
                choices: [
                    {
                        name: 'VideoJS',
                        value: 'hasVideo',
                        checked: false
                    },
                    {
                        name: 'JS timeline animations (TA)',
                        value: 'useTA',
                        checked: true
                    }
                ]
            },
            {
                type: 'list',
                name: 'bannerSize',
                message: 'What size do you need?',
                choices: [
                    { name: 'Sitebar (300x600)', value: 'sitebar' },
                    { name: 'Halfpage Ad (300x600)', value: 'halfpage-ad' },
                    { name: 'Content Ad/Medium Rectangle (300x250)', value: 'contentad' },
                    { name: 'Billboard-940 (940x250)', value: 'billboard-940' },
                    { name: 'Billboard-950 (950x250)', value: 'billboard-950' },
                    { name: 'Billboard-960 (960x250)', value: 'billboard-960' },
                    { name: 'Billboard-970 (970x250)', value: 'billboard-970' },
                    { name: 'Skyscraper (160x600)', value: 'skyscraper' },
                    { name: 'Superbanner (728x90)', value: 'superbanner' }
                ],
                filter: function (val) {
                    return val.toLowerCase();
                }
            }
        ];

        return this.prompt(prompts).then(
            function (answers) {
                var features = answers.features;

                function hasFeature(feat) {
                    return features && features.indexOf(feat) !== -1;
                }

                this.hasVideo = hasFeature('hasVideo');
                this.useTA = hasFeature('useTA');
                this.bannerSize = answers.bannerSize;
                this.isResponsive = this.bannerSize == 'sitebar';
                this.isClosable = this._hasClose();
                this.bannerName = this._convertDoubleToSingleQuotes(
                    answers.bannerName
                )
                    .replace(/\s/g, '')
                    .toLowerCase();
                this.description = this._convertDoubleToSingleQuotes(
                    answers.description
                );
            }.bind(this)
        );
    }

    writing() {
        this._writingGulpfile();
        this._writingPackageJSON();
        this._writingBabel();
        this._writingGit();
        this._writingEditorConfig();
        this._writingPrettier();
        this._writingStyles();
        this._writingScripts();
        this._writingHtml();
        this._writingMisc();
    }

    _writingGulpfile() {
        var css = [];
        if (this.hasVideo) {
            css.push('vjs.css');
        }
        css.push('*.{scss,sass}');

        this.fs.copyTpl(
            this.templatePath('_gulpfile.babel.js'),
            this.destinationPath('gulpfile.babel.js'),
            {
                pkg: this.pkg,
                sassCss: this._escapeArrayToString(css),
                includeSass: true,
                includeBabel: true,
                testFramework: '',
                includeBootstrap: false
            }
        );
    }

    _writingPackageJSON() {
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath('package.json'),
            {
                name: this.bannerName,
                description: this.description
            }
        );
    }

    _writingBabel() {
        this.fs.copy(
            this.templatePath('babelrc'),
            this.destinationPath('.babelrc')
        );
    }

    _writingGit() {
        this.fs.copy(
            this.templatePath('gitignore'),
            this.destinationPath('.gitignore')
        );
    }

    _writingEditorConfig() {
        this.fs.copy(
            this.templatePath('editorconfig'),
            this.destinationPath('.editorconfig')
        );
    }

    _writingPrettier() {
        this.fs.copy(
            this.templatePath('prettierrc'),
            this.destinationPath('.prettierrc')
        );
    }

    _writingStyles() {
        // copy css file and insert banner size
        this.fs.copyTpl(
            this.templatePath('_main.scss'),
            this.destinationPath('app/styles/main.scss'),
            {
                height: banner[this.bannerSize].height,
                width: banner[this.bannerSize].width,
                isClosable: this.isClosable,
                hasVideo: this.hasVideo,
                isResponsive: this.isResponsive
            }
        );

        // copy remaining styles
        this.fs.copy(
            this.templatePath('_normalize-7.0.0.css'),
            this.destinationPath('app/styles/normalize.css')
        );
        if (this.hasVideo) {
            this.fs.copy(
                this.templatePath('_vjs.css'),
                this.destinationPath('app/styles/vjs.css')
            );
        }
    }

    _writingScripts() {
        this.fs.copyTpl(
            this.templatePath('_core.js'),
            this.destinationPath('app/scripts/core.js'),
            {
                isResponsive: this.isResponsive,
                close: this.isClosable
            }
        );
        this.fs.copyTpl(
            this.templatePath('_core-adform.js'),
            this.destinationPath('app/scripts/core-adform.js'),
            {
                isResponsive: this.isResponsive,
                close: this.isClosable
            }
        );
        this.fs.copyTpl(
            this.templatePath('_core-dcm.js'),
            this.destinationPath('app/scripts/core-dcm.js'),
            {
                isResponsive: this.isResponsive
            }
        );
        this.fs.copyTpl(
            this.templatePath('_main.js'),
            this.destinationPath('app/scripts/main.js'),
            {
                hasVideo: this.hasVideo,
                useTA: this.useTA,
                close: this.isClosable
            }
        );
        if (this.useTA) {
            this.fs.copy(
                this.templatePath('_timedani.js'),
                this.destinationPath('app/scripts/timedani.js')
            );
        }
    }

    _writingHtml() {
        this.fs.copyTpl(
            this.templatePath('_index.html'),
            this.destinationPath('app/index.html'),
            {
                close: this.isClosable,
                isResponsive: this.isResponsive,
                hasVideo: this.hasVideo,
                useTA: this.useTA,
                height: banner[this.bannerSize].height,
                width: banner[this.bannerSize].width
            }
        );
    }

    _writingMisc() {
        // copy gitkeep to create empty images folder
        this.fs.copy(
            this.templatePath('gitkeep'),
            this.destinationPath('app/images/.gitkeep')
        );

        this.fs.copy(
            this.templatePath('eslintignore'),
            this.destinationPath('.eslintignore')
        );
    }

    install() {
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    }

    end() {
        this.log('All done!');
    }

    install() {
        this.npmInstall();
    }

    _convertDoubleToSingleQuotes(s) {
        return s.replace(/"/g, "'");
    }

    _escapeArrayToString(array) {
        var result = '';
        for (var i = 0, c = array.length; i < c; i++) {
            result += "'" + array[i] + "', ";
        }

        return result.slice(0, -2);
    }

    _hasClose() {
        return this.bannerSize == 'sitebar' || this.bannerSize == 'halfpage-ad';
    }
};
