from common import (chromedriver,
                    get_elem_by_selector,
                    wait_for_elem)
from selenium import webdriver
from selenium.common.exceptions import ElementNotVisibleException
import unittest
from time import sleep

START_LATITUDE = 'Start Latitude'
START_LONGTITUDE = 'Start Longitude'
END_LATITUDE = 'End Latitude'
END_LONGTITUDE = 'End Longitude'


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
        self.endMap = get_elem_by_selector(self.elena, '#endMap')

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

    def test_latitude_over_max(self):
        self.start_lat.send_keys('91')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('30.2')
        self.end_lat.send_keys('45.433')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()
        self.start_lat.send_keys('49')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('30.2')
        self.end_lat.send_keys('99')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()

    def test_latitude_under_min(self):
        self.start_lat.send_keys('-91')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('30.2')
        self.end_lat.send_keys('45.433')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()
        self.start_lat.send_keys('-1000')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('30.2')
        self.end_lat.send_keys('45.433')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()

    def test_longitude_over_max(self):
        self.start_lat.send_keys('-65')
        self.start_lon.send_keys('181')
        self.end_lon.send_keys('30.2')
        self.end_lat.send_keys('45.433')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()
        self.start_lat.send_keys('-65')
        self.start_lon.send_keys('2000')
        self.end_lon.send_keys('1000')
        self.end_lat.send_keys('45.433')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()

    def test_longtitude_under_min(self):
        self.start_lat.send_keys('-46')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('-181')
        self.end_lat.send_keys('45.433')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()
        self.start_lat.send_keys('-46')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('-465783')
        self.end_lat.send_keys('45.433')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()

    def test_error_message_correct_start_lat(self):
        self.start_lat.send_keys('-91')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('-134')
        self.end_lat.send_keys('45.433')
        self.submit()
        sleep(.5)
        errorText = get_elem_by_selector(self.elena, '#errorText').text
        self.assertTrue(START_LATITUDE in errorText)
        self.exit_modal()

    def test_error_message_correct_end_lat(self):
        self.start_lat.send_keys('-90')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('-134')
        self.end_lat.send_keys('7000')
        self.submit()
        sleep(.5)
        errorText = get_elem_by_selector(self.elena, '#errorText').text
        self.assertTrue(END_LATITUDE in errorText)
        self.exit_modal()

    def test_error_message_correct_start_lon(self):
        self.start_lat.send_keys('-90')
        self.start_lon.send_keys('-190')
        self.end_lon.send_keys('-134')
        self.end_lat.send_keys('45.433')
        self.submit()
        sleep(.5)
        errorText = get_elem_by_selector(self.elena, '#errorText').text
        self.assertTrue(START_LONGTITUDE in errorText)
        self.exit_modal()

    def test_error_message_correct_end_lon(self):
        self.start_lat.send_keys('-91')
        self.start_lon.send_keys('3.4')
        self.end_lon.send_keys('-191')
        self.end_lat.send_keys('45.433')
        self.submit()
        sleep(.5)
        errorText = get_elem_by_selector(self.elena, '#errorText').text
        self.assertTrue(END_LONGTITUDE in errorText)
        self.exit_modal()

    def test_error_message_correct_multiple(self):
        self.start_lat.send_keys('-91')
        self.start_lon.send_keys('1299')
        self.end_lon.send_keys('49292')
        self.end_lat.send_keys('null')
        self.submit()
        sleep(.5)
        errorText = get_elem_by_selector(self.elena, '#errorText').text
        self.assertTrue(START_LATITUDE in errorText)
        self.assertTrue(START_LONGTITUDE in errorText)
        self.assertTrue(END_LATITUDE in errorText)
        self.assertTrue(END_LONGTITUDE in errorText)
        self.exit_modal()

    def test_invalid_limit_in_error_message(self):
        self.limit.clear()
        self.limit.send_keys('101')
        self.submit()
        sleep(.5)
        errorText = get_elem_by_selector(self.elena, '#errorText').text
        self.assertTrue('Total Distance Limit' in errorText)
        self.exit_modal()

    def test_invalid_limit(self):
        self.limit.clear()
        self.limit.send_keys('101')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()
        self.limit.clear()
        self.limit.send_keys('-1')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()
        self.limit.clear()
        self.limit.send_keys('null')
        self.submit()
        self.assertTrue(wait_for_elem(self.modal, appear=True))
        self.exit_modal()
        self.limit.clear()
        self.limit.send_keys('true')
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
        self.assertTrue(self.endMap.is_displayed())


if __name__ == '__main__':
    unittest.main()
