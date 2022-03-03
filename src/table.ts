import { firstValueFrom, Observable, Subject } from 'rxjs';
import { SqlJoinType, SqlWhereQuery } from './models/sql.model';
import { SqlService } from './services/sql.service';

type Dataset<T> = Array<T>;

export class Table<T> {
  private _columns: Array<string>;
  private _sqlService: SqlService;
  public tableName: string;
  public dataset: Dataset<T>;

  constructor(tableName: string, schema, dataset?: Dataset<T>) {
    this.tableName = tableName;
    this.dataset = dataset || [];
    this._columns = Object.keys(new schema());
    this._sqlService = new SqlService(this.tableName, this._columns);
  }

  public find(sqlQuery: SqlWhereQuery): Observable<Dataset<T>> {
    const query = this._sqlService.createFindQuery(
      sqlQuery.columns,
      sqlQuery.condition,
      sqlQuery.limit,
      sqlQuery.tableName
    );
    const result = new Subject<Dataset<T>>();

    this._sqlService.pool.query(query, (err, rows: Dataset<T>, fields) => {
      if (err) console.error(err);
      result.next(rows);
    });

    return result.asObservable();
  }

  public findOne(sqlQuery: SqlWhereQuery): Observable<T> {
    const result = new Subject<T>();
    firstValueFrom(this.find(sqlQuery)).then((res) => result.next(res[0]));

    return result.asObservable();
  }

  public add(values: T): Observable<any> {
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

  public delete(condition: any): Observable<any> {
    const query = this._sqlService.createDeleteQuery(condition);
    const result = new Subject();

    this._sqlService.pool.query(query, (err, rows, fields) => {
      if (err) console.error(err);
      result.next(rows);
    });

    return result.asObservable();
  }

  public join(
    joinType: SqlJoinType,
    tableName: string,
    columnsToSelect: Array<string>,
    columnsOn: any
  ): Observable<any> {
    const query = this._sqlService.createJoinQuery(
      joinType,
      tableName,
      columnsToSelect,
      columnsOn
    );
    const result = new Subject();

    this._sqlService.pool.query(query, (err, rows, fields) => {
      if (err) console.error(err);

      result.next(rows);
    });

    return result.asObservable();
  }

  public union(queries: Array<SqlWhereQuery>, all = false): Observable<any> {
    const query = this._sqlService.createUnionQuery(queries, all);
    const result = new Subject();

    this._sqlService.pool.query(query, (err, rows, fields) => {
      if (err) console.error(err);

      result.next(rows);
    });

    return result.asObservable();
  }
}
