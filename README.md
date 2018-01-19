# MSL
a scripting language to make surveys. Its like php for making web pages.

# Project structure
Clone the repository. The repository contains 4 parts:
compiler
interpreter (vm)
reference-ui
ide

This is the general workflow

* user writes source code in ide
* compiler turns them into commands, commands reference Java byte code commands
* vm executes those commands, and determins how the first page looks like
* vm describes the looking of first page using json, and send the json to reference-ui
* reference-ui render the first page based on the json
* user answers questions on the first page
* reference-ui returns user's answer back to vm
* vm get the answers, continue executing the commands, and determins how the second page looks like
* vm describes the looking of the second page using json, and send the json to reference-ui
* ......

# How to try it
To try this (workflow) by yourself, install Node.js first. This is necessary to run the ide on my PC/Mac. 
You can find Node.js here: https://nodejs.org/en/

For windows there is a one click installer. For mac i would recommend homebrew.

Once you have Node installed, you can try `node --version`.

Now navigate to ide folder in this repo. And type `npm install` This will install all the dependencies needed to run ide. The ide makes use
of compiler and reference-ui. We already have those two compiled and included in ide.

After `npm install`, type `npm start`, and open your browser and try `localhost:3000`. You should be able to see the ide. For now, there is no
documentation about the code syntax....I will add it later. But I have prepared some sample scripts. You can paste them and click `run` button
in the ide run it.

# Tips of using IDE
Here are some other tips about using the ide
1. You can click on line number to place breakpoints. But there are some restrictions about where you can place a breakpoints. For instance, it
does not make any sense to place a breakpoint on a [Row]tag, just like you cannot place a breakpoint on an XML. If you place a breakpoint at
a an inappropriate place, the breakpoints will be ingored.

2. Sometimes you clicked resume debugging, and the scripts is still paused, thats probably because the survey requires you to provide some answer first.
Remember, there are two ways the scripts will stop executing.
  a. it hits a breakpoints
  b. it renders a page and it needs you to answer the questions on the page
  
3. You can evaluate addhoc scripts in the console. In windows, click `Ctrl + Enter` to execute.

# Sample scripts you can try
OK, thats enough talking, here are the sample scripts:

* `MSL/ide/test-data/ppt-survey-3`   (how you can use some basic logic to hide/show the questions)
* `MSL/ide/test-data/ppt-survey-4`   (how to make function calls)
* `MSL/ide/test-data/demo-survey-4`  (how to reuse the rows and columns)

# Sample scripts with plugins
reference-ui adopts an open apis for you to make plugins. You can make plugins for a specific client (to satisfy his special requirements),
or make general purpose plugin (to change background, font size, or add a banner at the top). Here are some scripts that uses plugins

* `MSL/ide/test-data/demo-survey`    (a video plugin, **please wait for a while for the videos to load**. _Click on different options to see how it works_)
* `MSL/ide/test-data/demo-survey-2`   (a dedicated plugin made for razer mouse, this customize the entire ui)
* `MSL/ide/test-data/demo-survey-3`   (a plugin thats adds support for maps, drap the point to indicate where you take lunch break)

# Files you might be interested
* `MSL/compiler/src/main/java/DLS/ParseTreeVisitor.java` (no docs though, it converts parse tree into abstract syntax tree)
* `MSL/compiler/src/main/java/DLS/CommandGenerator/Generator.java` (no docs though, generate commands based on abstract syntax tree)
* `MSL/interpreter/src/interpreter.ts` (with extensive comments, it execute the commands)

# Commonly asked questions
* Q: How come the syntax has this ugly `end` statement everywhere
* A: After talking with some friends in BU, I realize people don't like `{ } && || !`. It scares them. So I use `and or end` instead, at least they read better. 

* Q: Why not an existing language like JS?
* A: Well, thats my first plan as well, but then it is very difficult to ensure security. If you allow people to write JS, two cases can happen: 1. they are experts and they can do very tricky and harmful things, like read the cookie, jump to another page. 2. they are beginners and they make very naive but bad code, like inifinite loops and so on. Also, it is very difficult to add syntax sugar, like `select q1.r1` (to programmatically change user's answer) or `rank r1->r2->r3` (to change the rankings in a ranking questions. Furthermore, it is very difficult to build debuggers. Finally, we don't need to squeeze the last drop of performance like Typescript. But maybe in the future we will build a transcompiler...so that vm is used in dev and if you need a production build, it compiles to JS...

* Q: Whats next?
* A: So many things requires attention. To name some most important ones: docs, test cases, bug fixes, more features, built in support for multi languages and so on.
