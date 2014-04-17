---
comments : true
date     : 2014-04-11 09:40:46
layout   : post
slug     : opening-a-directory-with-pathfinder-from-the-terminal
title    : Opening a directory with PathFinder from the Terminal
summary  : Adding an alias to your zshrc file allows you to use the wrap terminal's -open- command to make a -pf- (PathFinder) command.
image    : 'opening-a-directory-with-pathfinder-from-the-terminal/opening-a-directory-with-pathfinder-from-the-terminal.png'
category : Tech-stuff # One of Tech-stuff, Learning, Random
tags     : # common: jekyll, webdev, rcstuff
- OSX
- webdev
---

For a few years I've been using Cocoatech's [PathFinder][1] app as a replacement for OSX's Finder app, which falls short at times for my needs.

I initially started using PathFinder in the pre-Mavericks days for tabbed and split-window file browsing. It rocked and I have since come to love some of its many features I occasionally use like batch renaming of files, built-in terminal, and checksum calculation.

I often, however am working from a *zsh* terminal and need to open a directory to do something to it. To open it with Finder I would do the following:

```bash
# Open current directory in Finder
$ open ./
```

It would be cool if I could do the same with PathFinder. While PathFinder doesn't have a cli (AFAIK), it was easy to [extend][2] the idea above by adding this to my *zsh* config file (in `~/.zshrc`):

```bash
#-> This allows one to open a path in PathFinder app
alias pf="open -a \"Path Finder.app\""
```

And use like so:

```bash
$ pf ./
```

I don't know why it took me so long to realise this could be done, but glad I did now. `pf` now complements other quick access commands I'm already fond of like:

```bash
$ stree ./ # Opens git repo in source tree app
$ subl ./  # Opens directory in SublimeText
```

Simple pleasures, I know. When you do this often, however, it feels good to have saved a few seconds in extra effort.

[1]: http://cocoatech.com/pathfinder/
[2]: http://alexking.org/blog/2011/11/20/open-in-pathfinder-from-the-terminal