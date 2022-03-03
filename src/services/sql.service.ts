import mysql from "mysql2";
import { TableColumn } from "../models/sql.model";
export class SqlService {
  private _tableName: string;
  private _columns: Array<string>;

  public pool: mysql.Pool;

  constructor(tableName: string, columns?: Array<string>) {
    this._tableName = tableName;
    this._columns = columns || [];
    this.pool = mysql.createPool({
      host: "localhost",
      user: "root",
      database: "forty",
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
    columns: Array<string> = ["*"],
    condition?: any,
    limit?: number
  ): string {
    return `SELECT ${columns} FROM ${this._tableName} ${
      this._sequelizeWhere(condition) ?? ""
    } ${limit ? "LIMIT " + limit : ""}`;
  }

  public createUpdateQuery(values: any, condition?: any) {
    const updateQuery = this._sequelizeColumns(values);
    return `UPDATE ${this._tableName} SET ${updateQuery} ${
      this._sequelizeWhere(condition) ?? ""
    }`;
  }

  public createDeleteQuery(condition) {
    return `DELETE FROM ${this._tableName} ${this._sequelizeWhere(condition)}`;
  }

  private _sequelizeCreateColumns(columns: Array<TableColumn>) {
    let result = "";
    columns.forEach((column, index) => {
      result += column.name + " ";
      result += column.type + " ";
      result += column.size ? `(${column.size}) ` : "";
      result += column.default ? `DEFAULT '${column.default}'` : "";
      result += column.primaryKey
        ? `${column.autoIncrement ? "AUTO_INCREMENT," : ""} PRIMARY KEY (${
            column.name
          })`
        : "";
      result += column.foreignKey
        ? `, FOREIGN KEY (${column.name}) REFERENCES ${column.foreignKey.referenceTable}(${column.foreignKey.referenceId})`
        : "";
      result += this._addIfLastIteration(columns, index, ", ");
    });

    return result;
  }

  private _sequelizeColumns(values: any): string {
    let result = "";

    const iterable = Object.keys(values);
    iterable.forEach(
      (key, i) =>
        (result += `${key} = ? ${this._addIfLastIteration(iterable, i, ", ")}`)
    );

    return result;
  }

  private _sequelizeWhere(obj: any): string | void {
    if (!obj) return;

    let result = "WHERE ";
    const iterable = Object.entries(obj);
    iterable.forEach(
      ([key, val], i) =>
        (result += `${key} = '${val}' ${this._addIfLastIteration(
          iterable,
          i,
          " AND "
        )}`)
    );

    return result;
  }

  private _addIfLastIteration(
    arr: Array<any>,
    index: number,
    strToAdd: string
  ) {
    return index === arr.length - 1 ? "" : strToAdd;
  }
}
