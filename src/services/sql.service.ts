import mysql from 'mysql2';
import dotenv from 'dotenv';
import {
  SqlJoinType,
  TableColumn,
  SqlWhereQuery,
  SqlUpdateQuery,
  SqlUnionQuery,
  SqlJoinQuery,
  ColumnToSelect,
  ColumnOn,
  JoinOrderBy,
  SqlAlterTableQuery,
  ModifyTableColumn,
} from '../models/sql.model';

dotenv.config();

export class SqlService {
  private _tableName: string;
  private _columns: Array<string>;

  public pool: mysql.Pool;

  constructor(tableName: string, columns?: Array<string>) {
    this._tableName = tableName;
    this._columns = columns || [];
    this.pool = mysql.createPool({
      host: process.env.FORTY_HOST,
      user: process.env.FORTY_USER,
      database: process.env.FORTY_DB,
      password: process.env.FORTY_PASS,
    });
  }

  public createTableQuery(columnsToCreate: Array<TableColumn>): Promise<any> {
    const query = `CREATE TABLE ${
      this._tableName
    } (${this._sequelizeCreateColumns(columnsToCreate)})`;

    return new Promise((resolve, reject) => {
      try {
        this.pool.query(query, (err, rows, fields) => {
          if (err) reject(err);

          resolve(rows);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  public alterTableQuery(sqlQuery: SqlAlterTableQuery): Promise<any> {
    const query = `ALTER TABLE ${this._tableName} ${this._sequelizeAlterColumns(
      sqlQuery
    )}`;

    return new Promise((resolve, reject) => {
      try {
        this.pool.query(query, (err, rows, fields) => {
          if (err) reject(err);

          resolve(rows);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  public dropTable(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.pool.query(
          `DROP TABLE ${this._tableName}`,
          (err, rows, fields) => {
            if (err) reject(err);

            resolve(rows);
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  public createInsertQuery(): string {
    return `INSERT INTO ${this._tableName} SET ?`;
  }

  public createFindQuery(sqlQuery?: SqlWhereQuery): string {
    if (!sqlQuery) return `SELECT * FROM ${this._tableName}`;

    return `SELECT ${sqlQuery.columns || '*'} FROM ${
      sqlQuery.tableName || this._tableName
    } ${this._sequelizeWhere(sqlQuery) ?? ''}`;
  }

  public createUpdateQuery(sqlQuery: SqlUpdateQuery) {
    const updateQuery = this._sequelizeColumns(sqlQuery.values);
    return `UPDATE ${this._tableName} SET ${updateQuery} ${
      this._sequelizeWhere(sqlQuery as SqlWhereQuery) ?? ''
    }`;
  }

  public createDeleteQuery(condition: any) {
    return `DELETE FROM ${this._tableName} ${this._sequelizeWhere({
      condition,
    })}`;
  }

  public createJoinQuery(sqlQuery: SqlJoinQuery): string {
    const query = this._sequelizeJoin(
      sqlQuery.joinType,
      sqlQuery.columnsOn,
      sqlQuery.columnsToSelect,
      sqlQuery.orderBy,
      sqlQuery.asc
    );
    return `${query}`;
  }

  private _sequelizeJoin(
    joinType: SqlJoinType,
    columnsOn: any,
    columnsToSelect: Array<ColumnToSelect>,
    orderBy?: Array<JoinOrderBy>,
    asc?: boolean
  ): string | void {
    if (!joinType) return;

    let result = 'SELECT ';

    columnsToSelect.forEach((column: ColumnToSelect, index: number) => {
      result += `${
        column.table
          ? `${column.table}.${column.column}`
          : `${this._tableName}.${column.column}`
      } ${column?.as ? `as ${column.as}` : ''} ${this._addIfLastIteration(
        columnsToSelect,
        index,
        ', '
      )}`;
    });

    result += `FROM ${this._tableName} `;

    columnsOn.forEach((column: ColumnOn) => {
      result += `${joinType} ${column.from.table} ON ${column.from.table}.${column.from.column} = ${column.to.table}.${column.to.column} `;
    });

    if (orderBy?.length) result += 'ORDER BY ';

    orderBy?.forEach((order: JoinOrderBy, index: number) => {
      result += `${order.table}.${order.column} ${this._addIfLastIteration(
        orderBy,
        index,
        ', '
      )}`;
    });

    if (orderBy?.length && (asc === true || asc === false))
      result += `${asc === true ? 'ASC' : asc === false ? 'DESC' : ''}`;

    return result;
  }

  public createUnionQuery(sqlQuery: SqlUnionQuery) {
    const query = this._sequelizeUnion(sqlQuery);
    return `${query}`;
  }

  private _sequelizeAlterColumns(sqlQuery: SqlAlterTableQuery): string {
    const { columnsToAdd, columnsToAlter, columnsToRemove } = sqlQuery;
    let result = '';

    columnsToAdd &&
      columnsToAdd?.forEach((column, index) => {
        result += 'ADD ';
        result += this._sequelizeCreateColumn(column);
        result += this._addIfLastIteration(columnsToAdd, index, ', ');
      });

    columnsToAlter &&
      columnsToAlter?.forEach((column, index) => {
        if (columnsToAdd?.length) result += ', ';
        result += this._sequelizeCreateColumn(column);
        result += this._addIfLastIteration(columnsToAlter, index, ', ');
      });

    columnsToRemove &&
      columnsToRemove?.forEach((column, index) => {
        if (columnsToAdd?.length || columnsToAlter?.length) result += ', ';
        result += `DROP COLUMN ${column.name}`;
        result += this._addIfLastIteration(columnsToRemove, index, ', ');
      });

    return result;
  }

  private _sequelizeCreateColumn(column: ModifyTableColumn) {
    let result = '';

    result += column?.newName ? ' CHANGE ' : '';
    result += column.name + ' ';
    result += column?.newName ? column.newName + ' ' : '';
    result += column.type ? column.type + ' ' : '';
    result += column.size ? `(${column.size}) ` : '';
    result += column.default ? `DEFAULT '${column.default}'` : '';
    result += column.primaryKey
      ? `${column.autoIncrement ? 'AUTO_INCREMENT,' : ''} PRIMARY KEY (${
          column.name
        })`
      : '';
    result += column.foreignKey
      ? `, FOREIGN KEY (${column.name}) REFERENCES ${column.foreignKey.referenceTable}(${column.foreignKey.referenceId})`
      : '';
    result += column.unique ? ' UNIQUE ' : '';
    return result;
  }

  private _sequelizeCreateColumns(columns: Array<TableColumn>) {
    let result = '';
    columns.forEach((column, index) => {
      result += this._sequelizeCreateColumn(column);
      result += this._addIfLastIteration(columns, index, ', ');
    });
    return result;
  }

  private _sequelizeColumns(values: any): string {
    let result = '';

    const iterable = Object.keys(values);
    iterable.forEach(
      (key, i) =>
        (result += `${key} = ? ${this._addIfLastIteration(iterable, i, ', ')}`)
    );

    return result;
  }

  private _sequelizeWhere(query: SqlWhereQuery): string | void {
    if (!query || !query.condition)
      return query.limit ? ` LIMIT ${query.limit}` : '';

    let result = 'WHERE ';
    const conditionArray = Object.entries(query.condition);
    conditionArray.forEach(([key, value], index) => {
      result += `${key} = '${value}' ${this._addIfLastIteration(
        conditionArray,
        index,
        ` ${query.operator ? query.operator : 'AND'} `
      )}`;
    });
    result +=
      query.isNull == false
        ? ` IS NOT NULL `
        : query.isNull == true
        ? ` IS NULL `
        : '';
    result += query.groupBy ? `GROUP BY ${query.groupBy} ` : '';
    result += query.orderBy
      ? `ORDER BY ${query.orderBy} ${query.asc ? 'ASC ' : ''} ${
          query.desc ? 'DESC ' : ''
        }`
      : '';
    result += query.having ? `HAVING ${query.having} ` : '';
    result += query.limit ? `LIMIT ${query.limit} ` : '';

    return result;
  }

  private _sequelizeUnion(sqlQuery: SqlUnionQuery): string | void {
    if (!sqlQuery.queries?.length) return;

    let result = '';
    sqlQuery.queries.forEach((query, index) => {
      result += `${this.createFindQuery(query)} ${this._addIfLastIteration(
        sqlQuery.queries,
        index,
        `UNION ${sqlQuery.all ? ' ALL  ' : ''}`
      )}`;
    });

    return result;
  }

  private _addIfLastIteration(
    arr: Array<any>,
    index: number,
    strToAdd: string
  ) {
    return index === arr.length - 1 ? '' : strToAdd;
  }
}
