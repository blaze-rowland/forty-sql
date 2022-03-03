import mysql from 'mysql2';
import dotenv from 'dotenv';
import { SqlJoinType, TableColumn, SqlWhereQuery } from '../models/sql.model';

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

  public createInsertQuery(): string {
    return `INSERT INTO ${this._tableName} SET ?`;
  }

  public createFindQuery(
    columns: Array<string> = ['*'],
    condition?: any,
    limit?: number,
    tableName?: string
  ): string {
    return `SELECT ${columns} FROM ${tableName || this._tableName} ${
      this._sequelizeWhere(condition) ?? ''
    } ${limit ? 'LIMIT ' + limit : ''}`;
  }

  public createUpdateQuery(values: any, condition?: any) {
    const updateQuery = this._sequelizeColumns(values);
    return `UPDATE ${this._tableName} SET ${updateQuery} ${
      this._sequelizeWhere(condition) ?? ''
    }`;
  }

  public createDeleteQuery(condition) {
    return `DELETE FROM ${this._tableName} ${this._sequelizeWhere(condition)}`;
  }

  public createJoinQuery(
    joinType: SqlJoinType,
    tableName: string,
    columnsToSelect: Array<string>,
    columnsOn: any
  ): string {
    const query = this._sequelizeJoin(
      joinType,
      tableName,
      columnsToSelect,
      columnsOn
    );

    return `${query}`;
  }

  public createUnionQuery(queries: Array<SqlWhereQuery>, all: boolean) {
    const query = this._sequelizeUnion(queries, all);
    return `${query}`;
  }

  private _sequelizeCreateColumns(columns: Array<TableColumn>) {
    let result = '';
    columns.forEach((column, index) => {
      result += column.name + ' ';
      result += column.type + ' ';
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

  private _sequelizeWhere(obj: any): string | void {
    if (!obj) return;

    let result = 'WHERE ';
    const iterable = Object.entries(obj);
    iterable.forEach(
      ([key, val], i) =>
        (result += `${key} = '${val}' ${this._addIfLastIteration(
          iterable,
          i,
          ' AND '
        )}`)
    );

    return result;
  }

  private _sequelizeJoin(
    joinType: SqlJoinType,
    tableName: string,
    columnsToSelect: Array<string>,
    columnsOn: { key: string; value: string }
  ): string | void {
    if (!tableName || !columnsOn || !columnsOn) return;

    let result = 'SELECT ';

    const fromAlias = tableName[0];
    const onAlias = this._tableName[0];

    columnsToSelect.forEach((column, index) => {
      result += `${fromAlias}.${column} ${this._addIfLastIteration(
        columnsToSelect,
        index,
        ', '
      )}`;
    });
    result += `FROM ${tableName} as ${fromAlias} ${joinType} ${this._tableName} as ${onAlias} ON `;
    Object.entries(columnsOn).forEach((key) => {
      result += `${fromAlias}.${key[0]} = ${onAlias}.${columnsOn[key[0]]}`;
    });

    return result;
  }

  private _sequelizeUnion(
    queries: Array<SqlWhereQuery>,
    all: boolean
  ): string | void {
    if (!queries?.length) return;

    let result = '';
    queries.forEach((query, index) => {
      result += `${this.createFindQuery(
        query.columns,
        query.condition,
        query.limit,
        query.tableName
      )} ${this._addIfLastIteration(
        queries,
        index,
        `UNION ${all ? ' ALL  ' : ''}`
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
