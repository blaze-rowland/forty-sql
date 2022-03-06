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
export interface TableColumn {
  name: string;
  type: SqlDataType;
  size?: number;
  default?: string;
  nullable?: boolean;
  primaryKey?: boolean;
  foreignKey?: ForeignKeyConstraint;
  autoIncrement?: boolean;
}

export interface SqlWhereQuery {
  columns: Array<string>;
  condition?: any;
  limit?: number;
  tableName?: string;
  groupBy?: Array<string>;
  orderBy?: Array<string>;
  having?: string;
  desc?: boolean;
  asc?: boolean;
  isNull?: boolean;
  operator?: 'AND' | 'OR' | 'NOT';
}

export interface SqlUpdateQuery {
  values: any;
  condition: any;
}

export interface SqlJoinQuery {
  joinType: SqlJoinType;
  tableName: string;
  columnsToSelect: Array<string>;
  columnsOn: any;
}

export interface SqlUnionQuery {
  queries: Array<SqlWhereQuery>;
  all: boolean;
}
