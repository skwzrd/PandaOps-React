import IDict from './dict';

export default interface ISetDf{
  status: number;
  name?: string;

  df?: string;
  
  fetched_rows?: number;
  length?: number;
  duplicates?: boolean;
  duplicates_count?: number;
  duplicates_index?: number;

  dtypes?: IDict;
  uniques?: IDict;
}