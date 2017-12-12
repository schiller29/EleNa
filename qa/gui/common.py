import os
from time import sleep

directory = os.getcwd()
chromedriver = directory + '/chromedriver'
os.environ["webdriver.chrome.driver"] = chromedriver


# defines function to dynamically make the elements specified in the selector

def get_elem_by_selector(elena, selector):
    return elena.find_element_by_css_selector(selector)


def wait_for_elem(elem, appear=True, timeout=3):
    times = 0
    while times < timeout:
        # Forces the tests to wait 1.5 seconds
        sleep(1.5)
        if appear and elem.is_displayed():
            return True
        elif appear:
                pass
        elif elem.is_displayed():
            pass
        else:
            return True
        times += 1

    raise ValueError('The element did not perform as expected in the alloted time')
