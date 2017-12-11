from common import chromedriver, webdriver, get_elem_by_selector
import unittest


class TestStringMethods(unittest.TestCase):
    """
    Helper methods
    """
    @classmethod
    def setUpClass(cls):
        cls.elena = webdriver.Chrome(chromedriver)
        cls.elena.get('http://localhost:4200/')
        cls.start_lat = get_elem_by_selector(cls.elena, '#startLatitude')
        cls.start_lon = get_elem_by_selector(cls.elena, '#startLongitude')
        cls.end_lat = get_elem_by_selector(cls.elena, '#endLatitude')
        cls.end_lon = get_elem_by_selector(cls.elena, '#endLongitude')
        cls.modal = get_elem_by_selector(cls.elena, '#modal')
        cls.submit = get_elem_by_selector(cls.elena, '#route')

    @classmethod
    def tearDownClass(cls):
        cls.elena.close()

    def tearDown(self):
        self.start_lat.send_keys('')
        self.start_lon.send_keys('')
        self.end_lat.send_keys('')
        self.end_lon.send_keys('')

    def scroll_to_bottom(self, top=False):
        if top:
            self.elena.execute_script("window.scrollTo(0, 0);")
        else:
            self.elena.execute_script("window.scrollTo(0, " +
                                      "document.body.scrollHeight);")
    """
    Test Cases
    """

    def test_empty(self):
        self.scroll_to_bottom()
        self.submit.click()
        self.assertTrue(self.modal.is_displayed())

if __name__ == '__main__':
    unittest.main()
