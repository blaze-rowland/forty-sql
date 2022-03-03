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
}
