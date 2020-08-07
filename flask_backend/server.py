import os
from io import BytesIO
import pandas as pd
from flask import Flask, jsonify, request
from cache import Cache
from json import load as json_load
from typing import NamedTuple

app = Flask(__name__)

c = Cache()

All = "All"
class props(NamedTuple):
    All = json_load(open('..\\src\\shared_props.json'))[All]

app.config.update(
    ALLOWED_FILETYPES={'.csv'},
    SECRET_KEY=os.urandom(24).hex(),
    SESSION_COOKIE_SAMESITE='Lax'
)

# How many df rows do you want retrieved per request
ROW_CHUNK = int(c.configs['ROW_CHUNK'])


def date_cols_to_strfmt(df):
    col_dtypes = {k:str(v) for k, v in df.dtypes.to_dict().items()}
    for k, v in col_dtypes.items():
        if 'datetime' in v:
            df[k] = df[k].astype(str)
    return df


def get_html_df(df, cmd, lower=0, upper=ROW_CHUNK):
    """Turns dfs into chunked json.

        Have this called after using any date metrics
        because dates get converted to string due to formatting
        limitations of to_json().
        https://github.com/pandas-dev/pandas/issues/22317
        """
    if df is not None:
        df = df.iloc[lower: upper]
        if cmd == props.All:
            df = date_cols_to_strfmt(df)
            df = df.to_json(orient='split')
        else:
            df = df.to_html()
    return df


def operate(df, cmd):
    """Performs operations on df based on command"""
    if cmd == 'Head':
        df = df.head()
    elif cmd == 'Tail':
        df = df.tail()
    elif cmd == 'Stats':
        df = df.describe()
    return df


def add_metrics(d, df):
    """Adds df metrics to d"""
    df_dups: pd.Series = df.duplicated()
    df_duplicate_indicies: pd.Series = df[df_dups==True].index

    _d = {
        'duplicates_bool': any(df_dups),
        'duplicates_count': len(df_duplicate_indicies),
        'duplicates_index': df_duplicate_indicies.to_list(),
        'length': len(df.index),
        'dtypes': {k:str(v) for k, v in df.dtypes.to_dict().items()},
        'unique_per_column': {col: df[col].nunique() for col in df.columns},
    }

    for k, v in _d.items():
        d[k] = v

    return d


def get_d_response(d, name, df, cmd):
    try:
        # We only want to get metrics when
        # a new df is selected
        if cmd == props.All:
            d = add_metrics(d, df)
            rows = len(df.index)
            if rows < ROW_CHUNK:
                d['fetched_rows'] = len(df.index)
            else:
                d['fetched_rows'] = ROW_CHUNK
        else:
            df = operate(df, cmd)
        d['name'] = name
        d['df'] = get_html_df(df, cmd)
        d['status'] = 1
    except Exception as e:
        print(e)
        d['status'] = 0
    return d


@app.route('/dataframe')
def get_df():
    """Retreives a df from storage.
    Returns a json object with name of df, df, function status"""

    name = request.args.get('name')
    cmd = request.args.get('cmd')

    d = {}
    d['status'] = 0
    df = c.get_df(name)

    if isinstance(df, pd.DataFrame):
        d = get_d_response(d, name, df, cmd)
    return jsonify(d)


@app.route('/fetchRows')
def fetch_rows():
    """Returns df containing with rows spanning from
        index lower to index lower + ROW_CHUNK"""

    name = request.args.get('name')
    lower = int(request.args.get('lower'))

    d = {}
    d['status'] = 0
    df = c.get_df(name)

    if isinstance(df, pd.DataFrame):
        d['name'] = name
        df = df.iloc[lower: lower + ROW_CHUNK]
        d['fetched_rows'] = len(df)
        d['df'] = get_html_df(df, props.All)
        d['status'] = 1
    return jsonify(d)


@app.route('/clear_cache')
def clear_cache():
    print(request.args)
    c.remove_all_dfs()
    d = {}
    d['status'] = 1
    return jsonify(d)


def get_df_from_request_file(f):
    """Given a request.files object, return its df"""
    filename = f.filename
    f_bytes = f.read()
    f.close()

    df = c.get_df(filename)
    if df is None:
        encodings = ['utf-8', 'latin1', 'cp1252']
        for i, encoding in enumerate(encodings):
            try:
                df = pd.read_csv(BytesIO(f_bytes), encoding=encoding)
                break
            except UnicodeDecodeError as e:
                if i == len(encodings) - 1:
                    raise UnicodeDecodeError(e)
                continue
        print('Adding df')
        c.add_df(filename, df)
    return df


@app.route('/upload_csv', methods=['POST'])
def upload_file():
    """Handles the upload of a csv file and processes it into a df.
        Returns a json object with name of df, df, function status"""
    d = {}
    try:
        file = request.files['file_from_react']
        print(f"Uploading file {file.filename}")
        df = get_df_from_request_file(file)
        d = get_d_response(d, file.filename, df, props.All)

    except Exception as e:
        print(f"Couldn't upload file {e}")
        d['status'] = 0

    return jsonify(d)

