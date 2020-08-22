import IDict from './dict';

export default interface State{
  name?: string;
  cmd?: string;

  names?: string[];

  df?: string;
  columns?: string[];
  data?: any[][];

  count?: number;
  fetched_rows?: number;
  length?: number;
  duplicates?: boolean;
  duplicates_count?: number;
  duplicates_index?: number;

  dtypes?: IDict;
  uniques?: IDict;
  
  All?: string;
  scrollOffset?: number;
}