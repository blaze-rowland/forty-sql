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
