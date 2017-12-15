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

1. Before running any tests, run `ng serve` to start the application. Selenium and Python are required to run some of the tests. Selenium can be installed at http://www.seleniumhq.org/projects/webdriver/ and Python can be installed at https://www.python.org/downloads/.
2. To test the routing algorithm, open the file 'src/app/options/test_algorithm.html' in a browser window. This will run the tests in 'src/app/options/test_algorithm.js' and show the number of failures.
3. To test the front-end of the application, run 'python qa/gui/test_ui_validation.py'
















In order to run testing, there is a script in the directory /src/app/options/ called 'test_algorithm.js' which uses the algorithm components to make assertions that the found path has a higher elevation change than the shortest path, and fits within the allotted
path length. To run, open a browser window with the file 'src/app/options/test_algorithm.html', which will run the tests and return the number of failures.

In relation to front-end testing, those are python based and use selenium to interact with the front-end.

Anyways, running the front-end tests are fairly simple. Chromedriver in the directory should be able to run
on Unix based systems or Windows. It is used to integrate between selenium and
newer browsers. If selenium is not installed yet, got to http://www.seleniumhq.org/projects/webdriver/
and install the appropriate dependencies. Once installed, the selenium import statements should be
working. Running the tests are simple:

python qa/gui/test_ui_validation.py



The output should look something like this: 

mschiller:gui mschiller$ python test_ui_validation.py
.....................
----------------------------------------------------------------------
Ran 21 tests in 106.899s

OK
