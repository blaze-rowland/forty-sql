import mysql from 'mysql2';
import { Subject } from 'rxjs';
import {
  SqlAlterTableQuery,
  SqlJoinQuery,
  SqlUnionQuery,
  SqlUpdateQuery,
  SqlWhereQuery,
  TableColumn,
} from '../models/sql.model';
import {
  createQuery,
  sequelizeAlterColumnsQuery,
  sequelizeCreateColumns,
  sequelizeDeleteQuery,
  sequelizeFindQuery,
  sequelizeInsertQuery,
  sequelizeJoinQuery,
  sequelizeUnionQuery,
  sequelizeUpdateQuery,
} from './utils/sequelize/sequelize';

export class SqlServiceClean {
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

  public createTable(columnsToCreate: Array<TableColumn>): Promise<any> {
    const query = createQuery([
      'CREATE TABLE',
      this._tableName,
      sequelizeCreateColumns(columnsToCreate),
    ]);

    console.log(query);

    return this._runQuery(query);
  }

  public dropTable(): Promise<any> {
    const query = createQuery(['DROP TABLE', this._tableName]);

    return this._runQuery(query);
  }

  public createFindQuery(sqlQuery?: SqlWhereQuery, tableName?: string): string {
    return sequelizeFindQuery(tableName || this._tableName, sqlQuery);
  }

  public createInsertQuery(): string {
    return sequelizeInsertQuery(this._tableName);
  }

  public createUpdateQuery(sqlQuery: SqlUpdateQuery): string {
    return sequelizeUpdateQuery(sqlQuery, this._tableName);
  }

  public createDeleteQuery(condition: any): string {
    return sequelizeDeleteQuery(condition, this._tableName);
  }

  public createAlterTableQuery(sqlQuery: SqlAlterTableQuery): string {
    return sequelizeAlterColumnsQuery(sqlQuery);
  }

  public createJoinQuery(sqlQuery: SqlJoinQuery): string | void {
    return sequelizeJoinQuery(sqlQuery, this._tableName);
  }

  public createUnionQuery(sqlQuery: SqlUnionQuery): string | void {
    return sequelizeUnionQuery(sqlQuery, this.createFindQuery, this._tableName);
  }

  public runQuery(query: any, values?: any) {
    const result = new Subject();

    this.pool.query(query, values, (err, rows, fields) => {
      if (err) console.error(err);
      result.next(rows);
    });

    return result.asObservable();
  }

  private _runQuery(query: string): Promise<any> {
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
}
