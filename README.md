# EleNa
EleNa is a web-based application for computing a route between two locations. EleNa provides the option to maximize or minimize elevation gain for the route. This implementation is intended to be used as a routing service for users that want a route with minimal or maximum elevation.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.5.

## How to install and run EleNa
1. After cloning, change to any directory in EleNa.
2. Run `npm install` to install any necessary packages. 
3. Run `ng serve` to start the application. 
4. Navigate to `http://localhost:4200/` to use the application.

## How to build EleNa
1. From anywhere in the EleNa directory, run `ng build` to build the project. 

* The build artifacts will be stored in the `dist/` directory.

## Running tests

1. Before running any tests, run `ng serve` to start the application. Selenium and Python are required to run some of the tests. Selenium can be installed at http://www.seleniumhq.org/projects/webdriver/ and Python can be installed at https://www.python.org/downloads/. It may be necessary to run pip install selenium to install the components for python.
2. To test the routing algorithm, open the file 'src/app/options/test_algorithm.html' in a browser window. This will run the tests in 'src/app/options/test_algorithm.js' and show the number of failures. 
3. To test the front-end of the application, run 'python qa/gui/test_ui_validation.py'