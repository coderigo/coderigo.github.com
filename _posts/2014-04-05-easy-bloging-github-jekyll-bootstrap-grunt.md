---
comments : true
date     : 2014-04-05 11:19:30
layout   : post
slug     : easy-bloging-github-jekyll-bootstrap-grunt
title    : "Easy Bloging = Github + Jekyll + Bootstrap + Grunt"
summary  : "The obligatory \"this is how I put this blog together\" post."
image    : 'easy-bloging-github-jekyll-bootstrap-grunt/Dev-Screenshot.png'
category : Tech-stuff
tags     :
- jekyll
- webdev
---

I'd been meaning to build a blog for a while but had never really gotten around to it. I, like many others I'm sure, briefly considered having a go with Wordpress but after spending all of 5 minutes reading their [installation instructions][10] I decided against it. Setting up a database, FTP transfers (granted other publish methods likely exist), faffing with web host settings etc. It all felt a bit early 2000s.

On my daily travels through the interwebs I learned of [Jekyll][1]. I was sold by the idea of being able to work on posts in markdown and being able to simply push to my [Github][2] repo to publish. Up to that point I didn't know that's how many Github projects write and maintain their pages or blogs.

Now, I'm not a Ruby guy, but Jekyll's easy enough to set up and manage that if you have some basic knowledge of [Git][3], [Github][2], some sort of command line, and some HTML and CSS you can set something decent-looking and working in close to no time without needing to do much faffing around learning Ruby (that wouldn't be a bad thing though). If you know a bit JavaScript it will help automating some things with [Grunt][4] and possibly do nice things with [jQuery][5] if you so desire. If you don't, this can perhaps be an opportunity to have a project to learn with.

Like all these things, one starts with the idea and then begins thinking of things one would like it to do and how it would look. I did a few sketches of how I'd like it to look and listed a few basic requirements. 

Below I set out some basic information on how I put this together for anyone with similar requirements who might chance upon this post. It'll help you get started.

## Environment

I think it's always helpful when reading *"how I did this"* posts to know what the general set up is as it can sometimes make a difference. So, with that in mind here is mine:

- OSX 10.9.2
- [homebrew][8]-managed packages
- `brew`-installed [Ruby][14] and `gem`.
- [zsh][6] as my shell <em>du-choice</em> (surely invalid French) managed by [ohmyzsh][7]
- [Chrome][13] and its devtools.
- [LiveReload][11] with its Chrome [browser extension][12]
- `brew`-installed [Node][15] (`$ brew install node`)
- `npm`-installed [GruntJS][16] command line interface (`$ npm install -g grunt-cli`)

OK, that list seems like a fair bit, but they're all easy things to set up and all things I already had because I use them daily.

## Requirements

So here's a basic list of what I wanted for my blog:

- A simple-looking blog with a basic sub-page categorisation of stuff I'm interested in : tech stuff, learning, and everything else.
- A look I can control myself.
- Comments I don't have to manage myself.
- Some automation for creating posts and drafts.
- A categorisation and tags system.

A quick look around on Stack Overflow and Google suggested this was all possible with stuff I already knew. So off I went.

Way more (and possibly accurate) info of what follows can be found on each project's site, so head there for more details as needed.

## Installation

As described in the [Jekyll docs][9] for me on OS X all that was needed was to install the latest stable realease by typing into the terminal:

```bash
$ gem install jekyll -v '2.0.0.alpha.1'
```

This gives access to a `jekyll` command through the terminal. Right?. Well, If I typed `jekyll help` at the terminal I got a *"command not found"* response. Hmmm. Over to Stack Overflow I went and came across [this][17] post detailing a similar problem. My problem showed similar symptoms but my solution was slightly different.

The problem was essentially that there was no symbolic link from `/usr/bin` to the path where the brew `gem`-installed Jekyll had been installed (somewhere in the Cellar) and my `PATH` variable wasn't searching there. I didn't want to have to edit my `PATH` variable every time I did this, so my solution was to simply *symlink* to `jekyll` like so:


```bash
$ gem env
    # Some Ruby env paths here
        - /usr/local/Cellar/ruby/1.9.3-p194/lib/ruby/gems/1.9.1
    # Some more output here

# Look in the above path for the jekyll binary 
# and paste its path below to create the symlink

$ cd /usr/bin && ln -s /usr/local/Cellar/ruby/1.9.3-p194/lib/ruby/gems/1.9.1/gems jekyll-1.4.3/bin/jekyll jekyll
```

Now all was well if I typed `jekyll help` at the terminal.

## Directory structure

At this point Jekyll is installed and ready to roll. But what directory structure does it expect and how does it all work?

I learn best from playing with something as opposed to reading docs, so I found a [great post][18] by Garry Welding which I cloned and used as a starting point as he suggested. Thanks Gaz!

```bash
$ git clone https://github.com/gkwelding/gkwelding.github.com.git coderigo.github.com
```

If you open it up you'll see a directory structure a bit like this:

```bash
$ tree -L 1
.
├── CNAME
├── README.md
├── Rakefile
├── _config.yml
├── _includes
├── _layouts
├── _plugins
├── _posts
├── _site
├── atom.xml
├── css
├── favicon.ico
├── img
├── index.html
├── js
├── search.json
└── tags
```

It looks like a fair bit and the best way to get familiar with it is to run `jekyll serve --watch` on it, which will start a web server, and edit stuff to see what it does. It took me maybe 30 or so minutes to begin to understand how it all works. Here are a few noteworthy points:

- All the directories beggining with `_` are inputs into Jekyll's build process and it either expects them (e.g. `_posts`) or knows they are options.
- An exception to the above point is `_site` directory, which is the built/processed version of your website ready for publishing. If you publish your repo to your Github account, Github will effectively run `jekyll build` on your repo and serve out your `_site` folder to the public.
- The `_config.yml` is *the* config file where you can set different markup languages, ignore directories when building, etc. The docs are pretty good on what you can include in this file.
- The `Rakefile` is a file that automates things like creating draft and new posts. I use Grunt instead, so I ended up not using this.
- The `CNAME` file simply lets your Github-served blog e.g (coderigo.github.io) to also be served from a domain you own (e.g. rodrigomartell.com).
- Anything placed in the root directory that Jekyll doesn't know about/expect will be copied over when the site is built. If you want it to ignore stuff, tell it so in `_config.yml`.
- `_includes` and `_layouts` help **a lot** to DRY out your templates. It uses liquid templating, which isn't that difficult to feel your way through. It felt very much like AngularJS templates to me.
- Loading of Disqus comments can be made by going to your Disqus account and simply pasting their provided embed code in the appropriate file in `_layouts`


So, with my requirements in mind I made a number of changes to:

- Include Bootstrap 3
- Use Grunt instead of Rakefile to automate tasks (including serving of the built site). I based it off what I saw [here][21] and [here][22].
- Add my own style and use `solarized-dark` css theme for code highlighting.
- Add drafts as described [here][19]
- Add LiveReload to make development easier

Feel free to clone [my repo][20] and use as a base like I did Garry's.

## Writing drafts and posts

With Grunt I can then start a server like so:

```bash
# from the root of my project
$ grunt
Running "startServer" task

Running "shell:jekyllBuild" (shell) task
Configuration file: /Users/rodrigomartell/dev/coderigo.github.com/_config.yml
            Source: /Users/rodrigomartell/dev/coderigo.github.com
       Destination: /Users/rodrigomartell/dev/coderigo.github.com/_site
      Generating... done.

Running "connect:livereload" (connect) task
Started connect web server on http://localhost:9000

Running "watch" task
Waiting...
```

LiveReload takes care of refreshing the page after I change any files in the spots I told Grunt to watch in `Gruntfile.js`.

I open up another terminal window where I can create drafts like so:

```bash
# from the root of my project
$ grunt draft:"A draft post"
```

This Grunt task will create a post based on the templates I set up in the `grunt_templates` directory. It makes sure the files are copied to the right places and named like Jekyll expects (spine-casing slugs and file names).

When I'm ready to promote a draft to a post I use grunt again like so:

```bash
# from the root of my project
$ grunt promoteDraft:"_drafts/a-draft-post.md"
```

That moves the post from `_drafts` to `_posts`, renaming it the way Jekyll expects and filling in today's date.

I can also jump straight into creating a post without drafting it if I'm feeling cocky:

```bash
# from the root of my project
$ grunt post:"A post"
```


## Publishing

This is perhaps the sweetest part. To publish your post you simply commit your changes to the repo and push up to a repo on Github you've set up that follows the naming convention `<your github username>.github.com`. So mine would be `coderigo.github.com`. Note that you must push to the `master` branch any changes you want Github to build as it ignores any others.

Github will take care of the rest for you. You might have to wait a few minutes before you can see your changes take effect.

```bash
$ git add _posts/
$ git commit -m "Add new posts"
$ git push origin
```

I'm by no means an experienced Jekyll user but I can already see that I will be using it a lot, seeing what it can do and learning as I continue to play with it.


[1]: http://jekyllrb.com/
[2]: http://github.com/
[3]: http://git-scm.com/
[4]: http://gruntjs.com/
[5]: http://jquery.com/
[6]: http://zsh.org/
[7]: https://github.com/robbyrussell/oh-my-zsh
[8]: http://brew.sh/
[9]: http://jekyllrb.com/docs/installation/
[10]: https://codex.wordpress.org/Installing_WordPress
[11]: http://livereload.com/
[12]: https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en
[13]: https://www.google.com/intl/en/chrome/browser/
[14]: https://www.ruby-lang.org/en/
[15]: http://nodejs.org/
[16]: http://gruntjs.com/
[17]: http://stackoverflow.com/questions/8146249/jekyll-command-not-found
[18]: http://in-the-attic.com/2013/01/04/building-a-blog-using-jekyll-bootstrap-and-github-pages-a-beginners-guide/
[19]: http://jekyllrb.com/docs/drafts/
[20]: https://github.com/coderigo
[21]: http://blog.parkji.co.uk/2013/08/12/jekyll-build-and-serve-using-grunt.html
[22]: http://kctang.github.io/jekyll/livereload/2014/01/25/github-pages-with-jekyll-and-livereload.html/