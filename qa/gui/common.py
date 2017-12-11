import os
from selenium import webdriver
from selenium.webdriver.common.by import By

directory = os.getcwd()
chromedriver = directory + '/chromedriver'
os.environ["webdriver.chrome.driver"] = chromedriver


# defines function to dynamically make the elements specified in the selector

def get_elem_by_selector(elena, selector):
    return elena.find_element_by_css_selector(selector)
