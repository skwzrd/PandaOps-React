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
# solve bug that hide Select button after a while
# check for duplicate records
# refactor components
# load more rows when scrolling down with "All" selected
# show number of loaded dfs


# DONE
# ====
# replace df list dropdown with <ul>
# rearrange buttons
# do not store df's in sessions (there is 4092 byte limit) - find something else
# css styling (good enough for now)


app = Flask(__name__, static_url_path='/static')

c = Cache()


app.config.update(
    ALLOWED_FILETYPES={'.csv'},
    SECRET_KEY=os.urandom(24).hex(),
    UPLOAD_FOLDER='static/temp',
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


@app.route('/dataframe')
def get_df():
    """Retreives a df from storage.
    Returns a json object with name of df, df, function status"""

    name = request.args.get('name')
    cmd = request.args.get('cmd')

    d = {}
    d['status'] = 0

    df = c.get_df(name)
    if name == 'sample':
        df = c.get_sample_df()
        c.add_df(name, df)
        
    if isinstance(df, pd.DataFrame):
        df = operate(df, cmd)
        d['name'] = name
        d['df'] = get_html_df(df)
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
        d['df'] = get_html_df(df)
        d['name'] = file.filename
        d['status'] = 1

    except Exception as e:
        print(f"Couldn't upload file {e}")
        d['status'] = 0

    return jsonify(d)

