import mysql from 'mysql2';
import { SqlDataType } from '../models/sql.model';

interface TableColumn {
  name: string;
  type: SqlDataType;
  size: number;
  foreign?: boolean;
  default?: string;
}

export class SqlService {
  private _tableName: string;
  private _columns: Array<string>;

  public pool: mysql.Pool;

  constructor(tableName: string, columns?: Array<string>) {
    this._tableName = tableName;
    this._columns = columns || [];
    this.pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'forty',
    });
  }

  public createTableQuery(columnsToCreate: Array<TableColumn>): string {
    /*
    CREATE TABLE Persons (
      PersonID int,
      LastName varchar(255),
      FirstName varchar(255),
      Address varchar(255),
      City varchar(255)
    );
    */
    return `CREATE TABLE ${this._tableName} ${this._sequelizeCreateColumns(
      columnsToCreate
    )}`;
  }

  public createInsertQuery(): string {
    return `INSERT INTO ${this._tableName} SET ?`;
  }

  public createFindQuery(
    columns: Array<string> = ['*'],
    condition?: any,
    limit?: number
  ): string {
    return `SELECT ${columns} FROM ${this._tableName} ${
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

  private _sequelizeCreateColumns(columns: Array<TableColumn>) {
    let result = '(';
    columns.forEach((obj, i) => {
      Object.entries(obj).forEach(() => {
        result += `${obj.name} ${obj.type} ${
          obj.size ? '(' + obj.size + ')' : ''
        } ${this._addIfLastIteration(columns, i, ', ')} ${
          obj.default ? ` DEFAULT '${obj.default}'` : ''
        }`;
        // console.log(i);
      });
    });
    console.log(result + ')');
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
    console.log(result);

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

new SqlService('products').createTableQuery([
  { name: 'id', type: 'INT', size: 11 },
  { name: 'fullName', type: 'VARCHAR', size: 255, default: 'Testy Test' },
]);
