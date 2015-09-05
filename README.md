# Feather

What the f--!? Another CSS framework??

Yea, but not really. This is more of a mashup. The last thing I want to do is re-invent the wheel. No time.

There are many great frameworks out there already. For me, I find many are simply too heavy and too opinionated. 
So many rely on jQuery and if you're going to use jQuery anyway, then that's not so bad...But what if you aren't?

Feather aims to be lightweight and beautiful. It isn't overly opinionated and so it doesn't come with quite as many 
components, but there's still enough to be a solid foundation for any project.

## Design Process

The other motivation for this little project is to have a better design process. Wireframes and more comprehensive layouts 
should be quick and easy to create. ***Most importantly, the framework should not have a strong opinion on your design.***

I think many existing CSS frameworks make it difficult to design first and then implement. They already took care of so 
much of the design process that many people build first and then design around what's on the page. It's just faster to 
show a client or investor this way. I get it, but you also have to realize design is taking a back seat in this case.

I'm not saying Feather won't be useful out of the box...It's just more like Pure.css in that it's going to be very 
clean, but empty. You will find yourself adding to it or using someone else's kit.

I hope to have many kits/themes available for use with Feather and these will often come with Sketch files that will 
make comps easier and faster to build. So expect some Sketch files too (or PSDs)!

## Main Vendors

I'll quickly run through the wonderful projects that made it into Feather. Since even CSS is now being built in a more modular 
way, it's possible to mix and match in some really great ways. This list may change as needed.

**Kube (http://imperavi.com/kube)**    
I literally just stumbled upon this CSS framework and it was a good part of the inspiration for Feather (along with Pure.css
which I've used in the past a bit). I needed a clean CSS framework to work off of. Kube and Pure.css were among the cleanest 
and smallest I've seen.

Kube has a few more features than I feel necessary so I've only taken part of Kube. The other reason for this is file size. 
Again, Feather needs to be lightweight. Regardless, Kube is half the size of Twitter Bootstrap (yes Bootstrap 4 will be smaller
than Bootstrap 3, but it'll still be much larger than Kube -- and Feather). So we're off to a good start. 

**Sassline (http://www.sassline.com)**    
Kube's type is clean, but basic. Sassline does the best job of aligning type to a baseline grid that I've seen yet (there's 
one other project that does it perfectly, but only for one typeface at specific sizes). Anyone who knows anything about setting
CSS type knows that it's a very difficult process and your CSS is basically only good for one typeface and one font-size scale. 
***If*** you want to be as perfect as possible.

Sassline works in a broader fashion and you will likely eventually end up having things not completely align to the baseline 
with it. However, to begin with -- things will sit on the baseline quite nicely. The treatment of the type is nice and everything 
is clean and legible. So for this reason, Sassline is used. It probably is the best (and most practical) CSS typography you'll find.

**baseline.js (https://github.com/daneden/Baseline.js)**    
I've pulled it into the core ```feather.js``` because it won't have many updates and it's small. No need for another submodule. 
I've also heavily modified it, dut I do want to credit it.

**ki.js (https://github.com/dciccale/ki.js)**    
This is an extremely small CSS selector library. It has no where near the same amount of features as jQuery or Zepto, etc. 
However, it's all we need for the components in this framework. Using jQuery or even Zepto would be **complete overkill** for
a simple dropdown menu or modal.

This keeps our JavaScript unopinionated and small. You are free to add jQuery or any other JavaScript you like. ...But you 
probably were going to anyway regardless of the CSS framework you use.

I've pulled this into the core repo manually instead of a git submodule or npm package. There have been some modifications.

**minibus.js (https://github.com/axelpale/minibus)**    
Yes, we could just apply all these event listeners in JavaScript, but it's annoying. That's why jQuery has its own system 
for handling events. Again, I want something small. Minibus is a very awesome script. It's 600 bytes when compressed. 
No bloat here!

This will emit all sorts of messages for your application to work with. You'll know when a modal is shown or hidden, etc. 
Minibus has a very simple interface, you'll love it. Or not, but it won't really bother you because there's no much to hate.

**cookies (https://github.com/ScottHamper/Cookies)**    
It's another 2.5kb (minified), but we need them. It's going to make storing visitor preferences easy for the components
this framework provides. You're also free to use it if you want to set cookies. It's a fantastic small library.

## Installing & Building

I've setup Grunt. You'll always find the fully built and minified project under the ```dist``` directory. Building isn't completely
straight forward, but it isn't too bad. The thing is the order in which CSS is being combined and the fact that some projects
are using Sass while others are using LESS. Also, not everythign can come in via NPM.

So, you'll want to basically get all the submodules, install the packages that are coming in via NPM and then use Grunt. 
To pop open a dev build in a browser do the following:

```git submodule update --init```    
```npm install```    
```grunt dev```

Then ```grunt build``` to build. **NOTE: This is still a work in progress.**

## Making Kits (or themes)

I will make a Grunt task to help you with this process.