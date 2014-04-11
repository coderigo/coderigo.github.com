---
comments : true
date     : 2014-04-09 00:00:00
layout   : post
slug     : osx-mavericks-wi-fi-dropouts
title    : OSX Mavericks Wi-Fi dropouts
summary  : How to fix Wi-Fi dropouts on OSX Mavericks 10.9.2. What worked for me at least.
image    : 'osx-mavericks-wi-fi-dropouts/OSX-Mavericks-Wi-fi-dropouts.png'
category : Random
tags     :
- troubleshooting
- OSX
---

For over a week now I've been experiencing some downright annoying behaviour on my Macbook Pro (MBP) after attempting to connect to Wi-Fi when I first arrive at work or home.

Whenever I wake it up from the sleep I put it for the trip the little Wi-Fi fan never fully lights up and fails to connect to a network it had hitherto had no problems remembering and connecting to. WTF?!

So I did what I wish everyone I work with would do when faced with *"a computer problem"* : Google it.

Wise old Google led me to a thread on [discussions.apple.com][1] (can't find it again when writing this) with a stack of posts saying it's a known (at least by the community) Mavericks 10.9.2 bug and the usual spray of fix suggestions.

Strangely, a fix I tried that worked for me was to :

1. Delete `/Library/Preferences/com.apple.Bluetooth.plist` (note that's root `/Library` not `~/Library`)
1. Open up *Keychain Access* app and search for entries of type *Airport network password* and **deleting** them, which means I'll have to re-enter them next time I connect to these networks. That sucks.

OK that worked but re-entering SSIDs and passwords got old after the second time. I proceeded to visit old G  and amongst its results spew it had a [post][2] on **howtoapple.com** listing a few things to try.

A few seemed like more effort than I was willing to pour in at the time but the penny dropped when I read the *Set Service Order* suggestion. What was happening to me was that in my attempts to fix this annoying issue I had dropped my *Home* network location where Wi-Fi trumped Bluetooth, leaving OSX to default to *Automatic* where Bluetooth trumped Wi-Fi. I had tried to tether from my Nexus 5 afterwards and every time I tried to connect to Wi-Fi after that it would connect to my Nexus 5 which had tethering was off. I think that's what happened anyway and that was good enough of an explanation for me as I moved on with life.

As suggested, I created a new service location called *"Home"*, set Wi-Fi to trump Bluetooth and all is well now.

![Fix for OSX Mavericks Wi-Fi dropouts](/img/posts/osx-mavericks-wi-fi-dropouts/OSX-Mavericks-Wi-fi-dropouts.png "Fix for OSX Mavericks Wi-Fi dropouts")

[1]:https://discussions.apple.com/message/24264798#24264798
[2]:http://howtoapple.com/mavericks-wifi-issues-fix/