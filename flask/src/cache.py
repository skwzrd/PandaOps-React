import redis
import pyarrow
import pandas as pd
import json
import subprocess
import os

import utils

# local redis exe filepath: C:\\Users\Michael\AppData\Local\redis\64bit\redis-server.exe
# where to download redis for windows: https://github.com/dmajkic/redis/downloads
# how to store dataframes with redis: https://stackoverflow.com/a/57986261/9576988

sample = 'sample'

class Cache:
    def __init__(self):
        self.r_context = pyarrow.default_serialization_context()

        self.configs = json.load(open('..\\..\\src\\configs.json'))

        try:
            with open(self.configs['redis_log'], mode='w') as f:
                self.proc = subprocess.Popen(
                    self.configs['redis_server_exe_path'],
                    stdout=f
                )
            self.r = redis.Redis(host='localhost', port=6379, db=0)
        except Exception as e:
            raise Exception(e)


    def get_keys(self):
        """Returns a list all df keys"""
        return [key.decode() for key in self.r.keys()]


    def get_df(self, key):
        """Given a key that exists, returns a df. Otherwise returns None"""
        df = None
        if self.key_exists(key):
            df = self.r_context.deserialize(self.r.get(key))
        elif key == sample:
            df = self.get_sample_df()
        return df


    def add_df(self, key, df):
        """Adds new df to storage"""
        self.r.set(key, self.r_context.serialize(df).to_buffer().to_pybytes())


    def remove_all_dfs(self):
        """Deletes all dfs"""
        for key in self.get_keys():
            self.r.delete(key)


    def remove_df(self, key):
        """Given a key that exists, deletes specified df and returns True.
            Otherwise returns False"""
        if self.key_exists(key):
            self.r.delete(key)
            return True
        return False


    def key_exists(self, key):
        """Returns a true if a key exists, false otherwise"""
        if self.r.exists(key) > 0:
            return True
        return False


    def get_sample_df(self):
        """Returns a sample df, also adds it to storage"""
        df = utils.get_sample_df()
        self.add_df(sample, df)
        return df


    def clean_up(self):
        """Terminates the redis processes"""
        self.proc.terminate()
        self.r.close()
