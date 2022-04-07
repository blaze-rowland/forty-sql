export type SqlStringType =
  | 'CHAR'
  | 'VARCHAR'
  | 'BINARY'
  | 'VARBINARY'
  | 'TINYBLOB'
  | 'TINYTEXT'
  | 'TEXT'
  | 'BLOB'
  | 'MEDIUMTEXT'
  | 'MEDIUMBLOB'
  | 'LONGTEXT'
  | 'LONGBLOB'
  | 'ENUM'
  | 'SET';

export type SqlNumericType =
  | 'BIT'
  | 'TINYINT'
  | 'BOOL'
  | 'BOOLEAN'
  | 'SMALLINT'
  | 'MEDIUMINT'
  | 'INT'
  | 'INTEGER'
  | 'BIGINT'
  | 'FLOAT'
  | 'DOUBLE'
  | 'DOUBLE'
  | 'PRECISION'
  | 'DECIMAL'
  | 'DEC';

export type SqlDateTimeType =
  | 'DATE'
  | 'DATETIME'
  | 'TIMESTAMP'
  | 'TIME'
  | 'YEAR';

export type SqlDataType = SqlStringType | SqlNumericType | SqlDateTimeType;

export type SqlJoinType = 'INNER JOIN' | 'RIGHT JOIN' | 'LEFT JOIN';

export interface ForeignKeyConstraint {
  referenceId: string;
  referenceTable: string;
}

export interface ColumnAlias {
  column: string;
  alias?: string;
}

export interface ColumnKeyValue {
  [column: string]: unknown;
}

export interface FindQuery {
  tableName?: string;
  columns?: Array<string>;
  conditions?: ColumnKeyValue;
  orderBy?: Array<string>;
  orderByDirection?: 'ASC' | 'DESC';
  limit?: number;
  top?: string;
  min?: ColumnAlias;
  max?: ColumnAlias;
  avg?: ColumnAlias;
  sum?: ColumnAlias;
  count?: string;
}

export interface CreateQuery {
  columns: Array<Column>;
}

export interface AlterQuery {
  columnsToAdd?: Array<Column>;
  columnsToModify?: Array<ColumnModify>;
  columnsToRemove?: Array<ColumnRemove>;
}

export interface UpdateQuery {
  conditions: ColumnKeyValue;
  values: ColumnKeyValue;
}

export type DeleteQuery = ColumnKeyValue;

export interface UpdateQuery {
  conditions: ColumnKeyValue;
  values: ColumnKeyValue;
}

export interface UnionQuery {
  columns?: Array<string>;
  conditions?: ColumnKeyValue;
  all?: boolean;
  union: {
    table: string;
    columns?: Array<string>;
    conditions?: ColumnKeyValue;
  };
}

export interface ColumnToSelect {
  column: string;
  as?: string;
  table?: string;
}

export interface OnTableColumn {
  column: string;
  table: string;
}

export interface ColumnOn {
  from: OnTableColumn;
  to: OnTableColumn;
}

export interface JoinQuery {
  joinType: SqlJoinType;
  columnsToSelect: Array<ColumnToSelect>;
  columnsOn: Array<ColumnOn>;
  orderBy?: Array<OnTableColumn>;
  asc?: boolean;
}

export interface Column {
  name: string;
  type: SqlDataType;
  size?: number;
  foreignKey?: ForeignKeyConstraint;
  default?: string;
  nullable?: boolean;
  autoIncrement?: boolean;
  primaryKey?: boolean;
  unique?: boolean;
}

export interface ColumnModify extends Column {
  oldName?: string;
  isForeign?: boolean;
}

export interface ColumnRemove {
  name: string;
  isForeign?: boolean;
}
