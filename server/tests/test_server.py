import unittest
import re

import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..\\src')))

import server, utils

class TestServer(unittest.TestCase):

    def test_get_d_response_ALL(self):
        # Providing:
        d = {}
        name = "sample"
        df = utils.get_sample_df()
        cmd = "All"

        # to the function:
        d = server.get_d_response(d, name, df, cmd)

        # we expect:
        keys = [
            'status',
            'name',
            'df',
            'fetched_rows',
            'length',
            'duplicates',
            'duplicates_count',
            'duplicates_index',
            'dtypes',
            'uniques'
        ]
        self.assertTrue(set(keys) == set(d.keys()))
        self.assertTrue(d["name"] == "sample")
        self.assertTrue(d["status"] == 1)
        df_json = {
            'columns': ['A', 'B', 'C', 'D', 'E', 'F'],
            'index': [0, 1, 2, 3],
            'data':
                [[1.0, '2013-01-02', 1.0, 3, 'test', 'foo'],
                [1.0, '2013-01-02', 1.0, 3, 'train', 'foo'],
                [1.0, '2013-01-02', 1.0, 3, 'test', 'foo'],
                [1.0, '2013-01-02', 1.0, 3, 'train', 'foo']]
        }
        self.assertTrue(d["df"] == df_json)
        self.assertTrue(d["fetched_rows"] == 4)
        self.assertTrue(d["length"] == 4)
        self.assertTrue(d["duplicates"] == True)
        self.assertTrue(d["duplicates_count"] == 2)
        self.assertTrue(d["duplicates_index"] == [2, 3])
        dtypes = {
            'A': 'float64',
            'B': 'datetime64[ns]',
            'C': 'float32',
            'D': 'int64',
            'E': 'category',
            'F': 'object'
        }
        self.assertTrue(d["dtypes"] == dtypes)
        uniques = {
            'A': 1,
            'B': 1,
            'C': 1,
            'D': 1,
            'E': 2,
            'F': 1
        }
        self.assertTrue(d["uniques"] == uniques)


    def test_get_d_response_Stats(self):
        # Providing:
        d = {}
        name = "sample"
        df = utils.get_sample_df()
        cmd = "Stats"

        # to the function:
        d = server.get_d_response(d, name, df, cmd)

        # we expect:
        keys = [
            'status',
            'name',
            'df'
        ]
        self.assertTrue(set(keys) == set(d.keys()))

        df_html = """
        <table border="1" class="dataframe">
        <thead>
            <tr style="text-align: right;">
            <th></th>
            <th>A</th>
            <th>C</th>
            <th>D</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <th>count</th>
            <td>4.0</td>
            <td>4.0</td>
            <td>4.0</td>
            </tr>
            <tr>
            <th>mean</th>
            <td>1.0</td>
            <td>1.0</td>
            <td>3.0</td>
            </tr>
            <tr>
            <th>std</th>
            <td>0.0</td>
            <td>0.0</td>
            <td>0.0</td>
            </tr>
            <tr>
            <th>min</th>
            <td>1.0</td>
            <td>1.0</td>
            <td>3.0</td>
            </tr>
            <tr>
            <th>25%</th>
            <td>1.0</td>
            <td>1.0</td>
            <td>3.0</td>
            </tr>
            <tr>
            <th>50%</th>
            <td>1.0</td>
            <td>1.0</td>
            <td>3.0</td>
            </tr>
            <tr>
            <th>75%</th>
            <td>1.0</td>
            <td>1.0</td>
            <td>3.0</td>
            </tr>
            <tr>
            <th>max</th>
            <td>1.0</td>
            <td>1.0</td>
            <td>3.0</td>
            </tr>
        </tbody>
        </table>
        """

        df_html = re.sub(r'\s+', '', df_html)
        d_df_html = re.sub(r'\s+', '', d['df'])
        self.assertTrue(df_html == d_df_html)

