from common import (chromedriver,
                    get_elem_by_selector,
                    wait_for_elem)
from selenium import webdriver
from selenium.common.exceptions import ElementNotVisibleException
import unittest


class TestStringMethods(unittest.TestCase):
    """
    Helper methods
    """
    @classmethod
    def setUpClass(cls):
        """
        Assumes the server has been started.
        """
        cls.elena = webdriver.Chrome(chromedriver)
        cls.elena.get('http://localhost:4200/')

    @classmethod
    def tearDownClass(cls):
        cls.elena.close()

    def tearDown(self):
        self.elena.refresh()

    def setUp(self):
        self.populate_elements()

    def empty_text_fields(self):
        self.start_lat.clear()
        self.start_lon.clear()
        self.end_lat.clear()
        self.end_lon.clear()

    def populate_elements(self):
        self.body = get_elem_by_selector(self.elena, 'body')
        self.start_lat = get_elem_by_selector(self.elena, '#startLatitude')
        self.start_lon = get_elem_by_selector(self.elena, '#startLongitude')
        self.end_lat = get_elem_by_selector(self.elena, '#endLatitude')
        self.end_lon = get_elem_by_selector(self.elena, '#endLongitude')
        self.modal = get_elem_by_selector(self.elena, '#modal')
        self.submit_button = get_elem_by_selector(self.elena, '#route')
        self.max_elevation = get_elem_by_selector(self.elena, '#maximize')
        self.min_elevation = get_elem_by_selector(self.elena, '#minimize')
        self.limit = get_elem_by_selector(self.elena, '#limit')

    def scroll_to_bottom(self, top=False):
        if top:
            self.elena.execute_script("window.scrollTo(0, 0);")
        else:
            self.elena.execute_script("window.scrollTo(0, " +
                                      "document.body.scrollHeight);")

    def exit_modal(self):
        try:
            get_elem_by_selector(self.elena, '#modal > div').click()
            wait_for_elem(self.body, appear=True)
        except ElementNotVisibleException:
            self.fail('Error modal was never displayed')

    def submit(self):
        self.scroll_to_bottom()
        self.submit_button.click()

    """
    Test Cases
    """

    def test_check_boxes(self):
        self.scroll_to_bottom()
        self.min_elevation.click()
        self.assertTrue(self.min_elevation.is_selected())
        self.max_elevation.click()
        self.assertTrue(self.max_elevation.is_selected())

    def test_check_boxes_both_cannot_be_enabled(self):
        self.scroll_to_bottom()
        self.min_elevation.click()
        self.max_elevation.click()
        self.assertTrue(self.max_elevation.is_selected())
        self.assertFalse(self.min_elevation.is_selected())
        self.max_elevation.click()
        self.min_elevation.click()
        self.assertFalse(self.max_elevation.is_selected())
        self.assertTrue(self.min_elevation.is_selected())

    def test_page_title(self):
        self.assertEqual(self.elena.title, 'Elena')

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

    def test_valid_decimal(self):
        self.start_lat.send_keys('20.0')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('30.2')
        self.end_lat.send_keys('45.433')
        self.submit()
        source = self.elena.page_source
        self.assertTrue('20.0' in source)
        self.assertTrue('3.4' in source)
        self.assertTrue('30.2' in source)
        self.assertTrue('45.433' in source)

    def test_valid_int(self):
        self.start_lat.send_keys('21')
        self.start_lon.send_keys('3')
        self.end_lon.send_keys('34')
        self.end_lat.send_keys('45')
        self.submit()
        source = self.elena.page_source
        self.assertTrue('21' in source)
        self.assertTrue('3' in source)
        self.assertTrue('34' in source)
        self.assertTrue('45' in source)

    def test_result_map(self):
        self.scroll_to_bottom()
        self.start_lat.send_keys('69')
        self.start_lon.send_keys('-34')
        self.end_lon.send_keys('33')
        self.end_lat.send_keys('45')
        self.min_elevation.click()
        self.limit.clear()
        self.limit.send_keys('10')
        self.submit()


if __name__ == '__main__':
    unittest.main()
