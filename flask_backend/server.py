import os
from io import BytesIO
import pandas as pd
from flask import Flask, jsonify, request
from cache import Cache

# TODO
# ====
# filter by column values
# show/hide column dtypes
# convert column dtypes
# apply methods on dfs
# create/remove columns
# plot df's
# save plots
# save modified df's
# hide/show left menu
# load more rows when scrolling down with "All" selected
# reduce number of api calls with react state logic

# DONE
# ====
# refactor components
# info panel
# check for duplicate records
# show number of loaded dfs
# replace df list dropdown with <ul>
# rearrange buttons
# do not store df's in sessions (there is 4092 byte limit) - find something else
# css styling (good enough for now)


app = Flask(__name__)

c = Cache()

app.config.update(
    ALLOWED_FILETYPES={'.csv'},
    SECRET_KEY=os.urandom(24).hex(),
    SESSION_COOKIE_SAMESITE='Lax'
)

# How many df rows do you want rendered per request
ROW_CHUNK = 10


def get_html_df(df, min_chunk=0, max_chunk=ROW_CHUNK, **kwargs):
    """Turns dfs into chunked html tables"""
    if df is not None:
        df = df.iloc[min_chunk: max_chunk]
        df = df.to_html(**kwargs)
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
        # print(str(k) + str(v))
        d[k] = v

    return d


def get_d_response(d, name, df, cmd):
    try:
        # We only want to get metrics when
        # a new df is selected
        if cmd == "All":
            d = add_metrics(d, df)
        df = operate(df, cmd)
        d['name'] = name
        d['df'] = get_html_df(df)
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
        d = get_d_response(d, file.filename, df, "All")

    except Exception as e:
        print(f"Couldn't upload file {e}")
        d['status'] = 0

    return jsonify(d)

