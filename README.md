K Kisekae2 auto updater
=======================
A script to download and patch K Kisekae2 so that it runs offline.

Keep in mind this was never suppose to be shared and has only been used by me, on windows.

Requires
 * [NodeJS and npm](http://nodejs.org/)
 * [SlimmerJS](http://slimerjs.org/download.html)
 * [7zip](http://www.7-zip.org/)'s 7za in your path somewhere (apt-get install p7zip should work.)
  * Windows users may have to add 7za.exe to their PATH.

 Getting the script to work
 --------------------------
 Download NodeJS and SlimerJS from above, install Nodejs.

 In the lib/slimerjs folder, extract the contents of slimerjs.

 Open a command prompt in the root directory of the script and run

    npm install

And it should work. Run the following:

    node path/to/kisekae-update
