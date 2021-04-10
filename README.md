<p align="center">

<a href="https://github.com/utsabk/SnapShare/graphs/contributors" alt="Contributors">
    <img src="https://img.shields.io/github/contributors/badges/shields" /></a>

<a href="https://www.gnu.org/licenses/gpl-3.0" alt="Contributors">
    <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" /></a>


</p>

<!-- PROJECT LOGO -->
<br />
<p align="center">
    <a href="http://">
        <img src="logo.png" >
    </a>
</p>

# Overview
SnapShare is an applicaton that allows users to snap pictures and share them up with friends insatntly.
On the other hand it also allows to view posts uploaded by friends and react to them.

# App features
* Snap a picture and upload it quickly.
* View all the posts by your friends.
* Sort all the posts new to old.
* React on friend's posts.
* Add comments to the pictures.


## Built With

- [Express.js](https://expressjs.com/) - Back end web applicaton framework for NodeJS.
- [REST API](https://restfulapi.net/) - The server will transfer to the client a representation of the state of the requested resource
- [JQuery](https://jquery.com) - A JavaScript library to handle events, DOM manipulation and make Ajax calls.
- [Node MySQL 2](https://github.com/sidorares/node-mysql2) - MySQL client for Node.js which supports prepared statements, non-utf8 endcodings, binary log protocol, compression and ssl.
- [Express-JWT](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [JSON Web Token](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [Passport](https://github.com/jaredhanson/passport) - For handling user authentication

## Application Structure


```
backend
    │
    └─── controllers            #request managers
    └─── db                     #connection to the DB
    └─── models                 #managing/handling database point            
    └─── routes                 #define the endpoints
    └─── server.js              #HTTP server that listens to server port
    └─── .env                   #store all environment variables
    └─── .gitignore             #git ignore file
    └─── package-lock.json      #npm automatically generated document
    └─── package.json           #holds metadata and npm packagage list
    └─── tables.txt             #queries to create DB tables

frontend
    │
    └─── public
        └─── css                #all css file
        └─── images             #all the images used
        └─── js                 #make request to backend and display the reponse    
        └─── profiles           #all the profile pictures
        └─── uploads            #all uploded images
        └─── auth.html          #html for authentication
        └─── index.html         #static page for home page

```

<!-- GETTING STARTED -->
# Requirements
For development and production, you will need Node.js and npm, installed in your environement. Additionally, setup MySQL database for databse storage.

### Node
- #### Node installation

  Just go on [official Node.js website](https://nodejs.org/) and download the installer or use your linux distro specific package manager to download it.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

If the installation was successful, you should be able to run the following command.

    $ node --version

    $ npm --version
    
### MySQL
- #### MySQL installation
 [Install](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/windows-install-archive.html)

 # Getting started

### Clone

To get the Node server running locally.

```sh
git clone git@github.com:utsabk/SnapShare.git
cd SnapShare
```
### Set up the local environment
Create a new file named `.env` with this environment variables.

   For example:
```
PORT= port where the server is listening to e.g 3000
DB_HOST= localhost
DB_USER=  database user
DB_PASS=  database password
DB_NAME=  database name
SECRET_KEY= JSON Web Token secret key
SALT_ROUNDS= salt rounds for bcrypt
```

After that run this command on project path

```sh
npm install
npm start
```
Your app should now be running on [localhost:3000](http://localhost:3000/)
