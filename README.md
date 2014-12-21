# K Kisekae2 auto updater
A script to download and patch K Kisekae2 so that it runs offline.

Just a nice little warning  
**This was never suppose to be  shared, and as such is completely untested on machines other than my own. So as of right now, it's only been tested on Windows 7.**

If you need help setting this up, message me here I guess.

Requires
 - [NodeJS and npm](http://nodejs.org/)
 - [SlimerJS](http://slimerjs.org/download.html)
 - [7zip](http://www.7-zip.org/)'s 7za in your path somewhere (`apt-get install p7zip` should work in theory.)
  - Windows users may have to add 7za.exe to their PATH.

## Getting the script to work
 - Download NodeJS and SlimerJS from above, install Nodejs.
 - In the lib/slimerjs folder, extract the contents of slimerjs.
 - Open a command prompt in the root directory of the script and run
```sh
npm install
```
And it should work. Run the following (for example):
```sh
    node path/to/kisekae-update k_k.141221
```
To download the current version to the folder k_k.141221, patch it for offline use and then 7z the archive with the password "4chan".
