Tracy Nguyen: fg18837
Aiyu Liu: cr18164

We will be developing a website for a small shop that sells Asian goods.

## Set up
Firt, check if you have node and npm installed by running these commands:
```node -v```
```npm -v````
If you don't have NodeJS yet, you can download it at https://nodejs.org/en/ or install it on MacOS with this command
```curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"```
Npm automatically comes with Nodejs I think.

Then, to install dependencies, run these two commands in the command line:
```
npm update
npm install
```
## Running the app

Either in debug mode:
$ DEBUG=site:* npm start
Or (preferred): 
nodemon app.js
Then visit http://localhost:3000/ to see the site.