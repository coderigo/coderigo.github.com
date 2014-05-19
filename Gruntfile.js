/**
 * A Grunt file to LiveReload Jekyll during development plus other useful bits
 */
var snakeCase = require('snake-case');
var shellTaskOptions = {
    stdout : true,
    stderr : true
};

module.exports = function(grunt){

    grunt.initConfig({
        'pkg' : grunt.file.readJSON('package.json'),
        'shell' : {
            jekyllBuild : {
                options : shellTaskOptions,
                command : 'jekyll build --drafts'
            },
            openInSublime : {
                options : shellTaskOptions,
                command : function(filePath){
                    return 'subl -n ./ ' + filePath; // Open SublimeText in new window. Change -a to -n to open in a new window.
                }
            },
            publish : {
                options : shellTaskOptions,
                command : 'rm -rf tags && jekyll build && mv _site/tags tags && git add _posts/ tags/ img/ && git commit -m "New build" && git push origin'
            },
            saveDrafts : {
                options : shellTaskOptions,
                command : 'git add _drafts/ img/ && git commit -m "New build" && git push origin'
            }
        },
        'watch' : {
            options : {
                livereload : '<%= connect.options.livereload %>'
            },
            files   : [
                'Gruntfile.js',
                '_includes/**/**',
                '_layouts/**',
                '_posts/**',
                '_drafts/**',
                'tech_stuff/**',
                'learning/**',
                'random/**',
                '_config.yml',
                'index.html',
                'css/**',
                'img/**/**/**'
            ],
            tasks : ['shell:jekyllBuild']
        },
        'connect': {
            options: {
                port       : 9000,
                livereload : 9090,
                hostname   : 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: ['_site']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-template');
    grunt.loadNpmTasks('grunt-text-replace');


    /**
     * Creates a post config for use 'draft' and 'post' tasks
     * @param  {string} postTitle A post title
     * @param  {bool}   dtaft     Whether to use a draft template
     * @return {object}           A post config object for 'draft' and 'post' tasks
     */
    var makeTemplateConfig = function(postTitle, draft){

        if(!postTitle){
            grunt.fatal('You gots to give me a post title, boy!', 3);
        }

        // Configure options for grunt-template task
        var postConfig = {
                slug     : snakeCase(postTitle.toLowerCase()).replace(/(_|\s|\.|,)/g,'-'),
                date     : '<%= grunt.template.today(\'yyyy-mm-dd\') %>'
            };
        var templateDestination = draft ? '_drafts/'+postConfig.slug+'.md' : '_posts/'+postConfig.date+'-'+postConfig.slug+'.md';
        var templateSource      = draft ? 'grunt_templates/draft.template' : 'grunt_templates/post.template';

        var templateTaskConfig = {
            'options' : {
                'data' : {
                    'title' : postTitle,
                    'slug'  : postConfig.slug
                }
            },
            'files'    : {},
            'postPath' : templateDestination
        };
        templateTaskConfig.files[templateDestination] = templateSource;

        return templateTaskConfig;
    };


    /**
     * Build Jekyll project and start a node server with livereload
     */
    grunt.registerTask('startServer', function(){
        grunt.task.run(['shell:jekyllBuild', 'connect', 'watch']);
    });


    /**
     * Set grunt's default to starting the server
     */
    grunt.registerTask('default', ['startServer']);

    /**
     * Make image directory for post
     * @param  {[string]} postTitle Spine-cased title of post
     */
    grunt.registerTask('makeImgDir', function(spineCasePostTitle){
        grunt.file.mkdir('img/posts/'+spineCasePostTitle);
    });

    /**
     * Create a Jekyll draft post
     * @param  {[string]} postTitle Title of post
     */
    grunt.registerTask('draft', function(postTitle, startServer){

        var templateConfig = makeTemplateConfig(postTitle, true);

        grunt.config('template.makeDraft', templateConfig);

        var taskSequence = [
            'template',
            'makeImgDir:'+templateConfig.options.data.slug,
            'shell:openInSublime:'+templateConfig.postPath
        ];

        if (startServer){
            taskSequence.push('startServer');
        }

        grunt.task.run(taskSequence);

    });

    /**
     * Remove a draft from the drafts
     * @param  {string} draftFilePath Path of draft
     * @return {nothing}              Hopefully a disappeared draft!
     */
     grunt.registerTask('nukeDraft', function(draftFilePath){
        grunt.file.delete(draftFilePath);
     });

    /**
     * Promote a draft to a post
     * @param  {[string]} draftFilePath Title of draft post
     */
    grunt.registerTask('promoteDraft', function(draftFilePath, startServer){

        var destinationPath = "_posts/"+grunt.template.today('yyyy-mm-dd')+"-"+draftFilePath.split('/')[1];

        grunt.config('replace', {
            'promoteDraft' : {
                'src'          : [draftFilePath],
                'dest'         : destinationPath,
                'replacements' : [{
                    'from' : /(date\s+:\s+)(.+)/g,
                    'to'   : "$1<%= grunt.template.today('yyyy-mm-dd hh:MM:ss') %>"
                }]
            }
        });

        var taskSequence = ['replace', 'nukeDraft:'+draftFilePath];

        if (startServer){
            taskSequence.push('startServer');
        }

        grunt.task.run(taskSequence);

    });


    /**
     * Create a Jekyll post file from a template
     * @param  {[string]} postTitle Title of post
     */
    grunt.registerTask('post', function(postTitle, startServer){

        var templateConfig = makeTemplateConfig(postTitle, false);

        grunt.config('template.makePost', templateConfig);

        var taskSequence = [
            'template',
            'makeImgDir:'+templateConfig.options.data.slug,
            'shell:openInSublime:'+templateConfig.postPath
        ];

        if (startServer){
            taskSequence.push('startServer');
        }

        grunt.task.run(taskSequence);

    });

    /**
     * Publish to github
     */
    grunt.registerTask('publish', function(){

        grunt.task.run('shell:publish');

    });

    /**
     * Save drafts to github
     */
    grunt.registerTask('saveDrafts', function(){

        grunt.task.run('shell:saveDrafts');

    });
};