# Elena

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


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


Those should cover the known issues I have encountered when setting up the testing framework.

Also, of course the web-app needs to be running on localhost port 4200.
