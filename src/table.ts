import { Observable } from 'rxjs';
import { SqlService } from './services/sql.service';

type Dataset<T> = Array<T>;

export class Table<T> {
  private _tableName: string;
  private _columns: Array<string>;
  private _sqlService: SqlService;
  public dataset: Dataset<T>;

  constructor(tableName: string, schema, dataset?: Dataset<T>) {
    this._tableName = tableName;
    this._columns = Object.keys(new schema());
    this._sqlService = new SqlService(this._tableName, this._columns);
    this.dataset = dataset || [];
  }

  public find(
    columns?: Array<string>,
    condition?: any,
    limit?: number
  ): void | Observable<any> {
    const query = this._sqlService.createFindQuery(columns, condition, limit);
    console.log(query);

    this._sqlService.pool.query(query, (err, rows, fields) => {
      if (err) console.error(err);

      console.log('row', rows);
    });
  }

  public add(values: T): void | Observable<any> {
    const query = this._sqlService.createInsertQuery();

    this.dataset.push(values);
    this._sqlService.pool.query(query, values, (err, rows, fields) => {
      if (err) console.error(err);
      console.log('rows', rows);
    });
  }

  public update(values: any, condition: any) {
    const query = this._sqlService.createUpdateQuery(values, condition);

    this._sqlService.pool.query(
      query,
      Object.values(values),
      (err, rows, fields) => {
        if (err) console.error(err);

        console.log('rows', rows);
      }
    );
  }

  public delete(condition: any) {
    const query = this._sqlService.createDeleteQuery(condition);

    this._sqlService.pool.query(query, (err, rows, fields) => {
      if (err) console.error(err);

      console.log('rows', rows);
    });
  }
}
