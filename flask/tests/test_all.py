import unittest

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..\\src')))

from test_server import TestServer
from test_cache import TestCache


def suite():
    suite = unittest.TestSuite()

    suite.addTest(TestServer('test_get_d_response_ALL'))
    suite.addTest(TestServer('test_get_d_response_Stats'))
    
    suite.addTest(TestCache('test_instance'))
    return suite

if __name__ == '__main__':
    runner = unittest.TextTestRunner()
    runner.run(suite())

