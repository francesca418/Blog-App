# CIS 557 Final Project: Blog-App

### Project Authors: Sardar Asfandyar Cheema, Jiyu Chen, Shu Chen, Francesca Marini

Welcome to Blog-App! 

This was a final project for CIS 557: Programming for the Web, offered in Fall 2021 at the University of Pennsylvania, for Prof. Eric Fouh.

Blog-App is a Reddit-like, MERN-stack application.

For highly detailed documentation of the code and contributions, please see our [Project Wiki](https://github.com/francesca418/Blog-App/wiki).

### Deployment

This app was deployed using Heroku. You can view it at this address: https://blog-app-project-21.herokuapp.com

### Setup & Running the Application Locally

To run this application locally, you can run the following code:

Cloning the Repo:
```
git clone [this repo address]
cd [this repo folder]
```

Setting up the Server:
```
npm install
npm start
```

Setting up the Client:
```
cd client
npm install
npm start
```

### Housekeeping

Please refer to the [Project Wiki](https://github.com/francesca418/Blog-App/wiki) for detailed documentation.

The project management for this document was done via a [Kanban Board Project](https://github.com/cis557/fall-2021-project-group-centric-social-network-team-21/projects/1) in Github.

There are several branches in this repo; however, there are really only four relevant, active branches of interest.
1. ```implementation branch:``` this branch contains all of the development code for the app.
2. ```backend-testing branch:``` this branch contains ALL of the unit testing for the app.
3. ```end-to-end-testing branch:``` this branch contains all of the functional testing for the app.
4. ```main branch:``` this branch contains the final iteration of the app.

The merge flow is as follows:
- implementation -> backend-testing -> main
- implementation -> end-to-end-testing

### Testing & Code Coverage

The tests included in this repo achieve high code coverage. 
Below is an image of the code coverage attained:
![code-coverage](https://github.com/cis557/fall-2021-project-group-centric-social-network-team-21/blob/development/testing-coverage.png)
