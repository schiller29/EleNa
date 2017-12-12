from common import (chromedriver,
                    get_elem_by_selector,
                    wait_for_elem)
from selenium import webdriver
import unittest


class TestStringMethods(unittest.TestCase):
    """
    Helper methods
    """
    @classmethod
    def setUpClass(cls):
        cls.elena = webdriver.Chrome(chromedriver)
        cls.elena.get('http://localhost:4200/')
        cls.body = get_elem_by_selector(cls.elena, 'body')
        cls.start_lat = get_elem_by_selector(cls.elena, '#startLatitude')
        cls.start_lon = get_elem_by_selector(cls.elena, '#startLongitude')
        cls.end_lat = get_elem_by_selector(cls.elena, '#endLatitude')
        cls.end_lon = get_elem_by_selector(cls.elena, '#endLongitude')
        cls.modal = get_elem_by_selector(cls.elena, '#modal')
        cls.submit_button = get_elem_by_selector(cls.elena, '#route')

    @classmethod
    def tearDownClass(cls):
        cls.elena.close()

    def tearDown(self):
        self.empty_text_fields()

    def empty_text_fields(self):
        self.start_lat.clear()
        self.start_lon.clear()
        self.end_lat.clear()
        self.end_lon.clear()

    def scroll_to_bottom(self, top=False):
        if top:
            self.elena.execute_script("window.scrollTo(0, 0);")
        else:
            self.elena.execute_script("window.scrollTo(0, " +
                                      "document.body.scrollHeight);")

    def exit_modal(self):
        get_elem_by_selector(self.elena, '#modal > div').click()
        wait_for_elem(self.body, appear=True)

    def submit(self):
        self.scroll_to_bottom()
        self.submit_button.click()

    """
    Test Cases
    """

    def test_empty(self):
        self.submit()
        self.assertTrue(self.modal.is_displayed())
        self.exit_modal()

    def test_one_empty(self):
        self.start_lat.send_keys('20.0')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('30.2')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()

    def test_two_empty(self):
        self.start_lat.send_keys('20.0')
        self.end_lon.send_keys('30.2')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()

    def test_valid(self):
        self.start_lat.send_keys('20.0')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('30.2')
        self.end_lat.send_keys('45.433')
        self.submit()
        # TODO these assertions do not work
        self.assertEqual(self.start_lat.text, '20.0')
        self.assertEqual(self.start_lon.text, '3.4')
        self.assertEqual(self.end_lat.text, '30.2')
        self.assertEqual(self.end_lon.text, '45.433')

if __name__ == '__main__':
    unittest.main()
