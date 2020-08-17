import pandas as pd

def get_sample_df():
    df = pd.DataFrame({
        'A': 1.,
        'B': pd.Timestamp('20130102'),
        'C': pd.Series(1, index=list(range(4)), dtype='float32'),
        'D': [3] * 4,
        'E': pd.Categorical(["test", "train", "test", "train"]),
        'F': 'foo'
    })
    return df