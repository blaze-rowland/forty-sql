import mysql from 'mysql2';
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
  sequelizeJoinQuery,
  sequelizeUnionQuery,
  sequelizeUpdateQuery,
} from './utils/sequelize/sequelize';

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

  public createTable(columnsToCreate: Array<TableColumn>): Promise<any> {
    const query = createQuery([
      'CREATE TABLE',
      this._tableName,
      sequelizeCreateColumns(columnsToCreate),
    ]);

    return this._runQuery(query);
  }

  public dropTable(): Promise<any> {
    const query = createQuery(['DROP TABLE', this._tableName]);

    return this._runQuery(query);
  }

  public createFindQuery(sqlQuery: SqlWhereQuery): string {
    return sequelizeFindQuery(sqlQuery, this._tableName);
  }

  public createInsertQuery(): string | any {
    return `INSERT INTO ${this._tableName} SET ?`;
  }

  public createUpdateQuery(sqlQuery: SqlUpdateQuery): string | any {
    return sequelizeUpdateQuery(sqlQuery, this._tableName);
  }

  public createDeleteQuery(condition: any): string | any {
    return sequelizeDeleteQuery(condition, this._tableName);
  }

  public createAlterTableQuery(
    sqlQuery: SqlAlterTableQuery
  ): Promise<any> | any {
    return sequelizeAlterColumnsQuery(sqlQuery);
  }

  public createJoinQuery(sqlQuery: SqlJoinQuery): string | any {
    return sequelizeJoinQuery(sqlQuery, this._tableName);
  }

  public createUnionQuery(sqlQuery: SqlUnionQuery): string | any {
    return sequelizeUnionQuery(sqlQuery, this.createFindQuery);
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
