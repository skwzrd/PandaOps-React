import unittest
import re

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..\\src')))

import cache

class TestCache(unittest.TestCase):
    
    def test_instance(self):
        c = cache.Cache()
        c.remove_all_dfs()

        # adding keys
        c.add_df('one', 1)
        c.add_df('two', 2)
        self.assertTrue(set(c.get_keys()) == set(['one', 'two']))
        self.assertTrue(c.key_exists('one'))

        # removing key
        c.remove_df('one')
        self.assertFalse(c.key_exists('one'))
        self.assertTrue(c.get_keys() == ['two'])

        # overwriting key values
        c.add_df('one', 1)
        self.assertTrue(set(c.get_keys()) == set(['one', 'two']))
        c.add_df('one', 9999)
        self.assertTrue(c.get_df('one') == 9999)
        self.assertTrue(set(c.get_keys()) == set(['one', 'two']))

        # emptying entire cache
        c.remove_all_dfs()
        self.assertTrue(c.get_keys() == [])

        c.clean_up()

