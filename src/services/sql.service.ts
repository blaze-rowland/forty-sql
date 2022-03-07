import mysql from 'mysql2';
import dotenv from 'dotenv';
import {
  SqlJoinType,
  TableColumn,
  SqlWhereQuery,
  SqlUpdateQuery,
  SqlJoinQuery,
  SqlUnionQuery,
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
      this._sequelizeWhere(sqlQuery.condition) ?? ''
    }`;
  }

  public createDeleteQuery(condition: any) {
    return `DELETE FROM ${this._tableName} ${this._sequelizeWhere(condition)}`;
  }

  public createJoinQuery(sqlQuery: SqlJoinQuery): string {
    const query = this._sequelizeJoin(
      sqlQuery.joinType,
      sqlQuery.tableName,
      sqlQuery.columnsToSelect,
      sqlQuery.columnsOn
    );

    return `${query}`;
  }

  public createUnionQuery(sqlQuery: SqlUnionQuery) {
    const query = this._sequelizeUnion(sqlQuery);
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
      result += column.unique ? ' UNIQUE ' : '';
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
    if (!query) return;

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
