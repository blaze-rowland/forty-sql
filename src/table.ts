import { firstValueFrom, Observable, Subject } from "rxjs";
import { SqlService } from "./services/sql.service";

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
  ): Observable<Dataset<T>> {
    const query = this._sqlService.createFindQuery(columns, condition, limit);
    const result = new Subject<Dataset<T>>();

    this._sqlService.pool.query(query, (err, rows: Dataset<T>, fields) => {
      if (err) console.error(err);
      result.next(rows);
    });

    return result.asObservable();
  }

  public findOne(columns?: Array<string>, condition?: any): Observable<T> {
    const result = new Subject<T>();
    firstValueFrom(this.find(columns, condition, 1)).then((res) =>
      result.next(res[0])
    );

    return result.asObservable();
  }

  public add(values: T): void | Observable<any> {
    const query = this._sqlService.createInsertQuery();
    const result = new Subject();

    this.dataset.push(values);

    this._sqlService.pool.query(query, values, (err, rows, fields) => {
      if (err) console.error(err);
      result.next(rows);
    });

    return result.asObservable();
  }

  public update(values: any, condition: any): Observable<any> {
    const query = this._sqlService.createUpdateQuery(values, condition);
    const result = new Subject();

    this._sqlService.pool.query(
      query,
      Object.values(values),
      (err, rows, fields) => {
        if (err) console.error(err);
        result.next(rows);
      }
    );

    return result.asObservable();
  }

  public delete(condition: any) {
    const query = this._sqlService.createDeleteQuery(condition);
    const result = new Subject();

    this._sqlService.pool.query(query, (err, rows, fields) => {
      if (err) console.error(err);
      result.next(rows);
    });

    return result.asObservable();
  }
}
