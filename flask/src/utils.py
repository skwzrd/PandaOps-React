import pandas as pd

def get_sample_df():
    length = 9
    df = pd.DataFrame({
        'A': list(range(length)) + [length-1],
        'B': pd.date_range(start='1/7/2020', periods=length, freq='M').append(pd.DatetimeIndex(['2020-09-30'])),
        'C': 9.0,
        'D': [10., 12., 11., 3., 6., 5., 4., 0., 4., 4.],
        'E': [4., 4., 11., 3., 6., 5., 4., 0., 4., 2.][::-1],
        'F': pd.Categorical(['even' if i%2==0 else 'odd' for i in range(length)] + ['even']),
        'G': 'canada'
    })
    return df