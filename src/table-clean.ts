import { firstValueFrom, Observable, Subject } from 'rxjs';
import {
  SqlJoinQuery,
  SqlUnionQuery,
  SqlUpdateQuery,
  SqlWhereQuery,
} from './models/sql.model';
import { SqlServiceClean } from './services/sql.service-clean';

type Dataset<T> = Array<T>;

export abstract class TableClean<T> {
  private _columns: Array<string>;
  private _sqlService: SqlServiceClean;

  public tableName: string;
  public dataset: Dataset<T>;

  constructor(tableName: string, schema, dataset?: Dataset<T>) {
    this.tableName = tableName;
    this.dataset = dataset || [];
    this._columns = Object.keys(new schema());
    this._sqlService = new SqlServiceClean(this.tableName, this._columns);
  }

  public find(sqlQuery?: SqlWhereQuery): Observable<any> {
    const query = this._sqlService.createFindQuery(sqlQuery);
    return this._createObservableFromQuery(query);
  }

  public findOne(sqlQuery: SqlWhereQuery): Observable<T> {
    const result = new Subject<T>();
    firstValueFrom(this.find(sqlQuery)).then((res) => result.next(res[0]));

    return result.asObservable();
  }

  public add(values: T): Observable<any> {
    const query = this._sqlService.createInsertQuery();
    return this._createObservableFromQuery(query, values);
  }

  public update(sqlQuery: SqlUpdateQuery): Observable<any> {
    const query = this._sqlService.createUpdateQuery(sqlQuery);
    return this._createObservableFromQuery(
      query,
      Object.values(sqlQuery.values)
    );
  }

  public delete(condition: any): Observable<any> {
    const query = this._sqlService.createDeleteQuery(condition);

    return this._createObservableFromQuery(query);
  }

  public join(sqlQuery: SqlJoinQuery): Observable<any> {
    const query = this._sqlService.createJoinQuery(sqlQuery);
    return this._createObservableFromQuery(query);
  }

  public union(sqlQuery: SqlUnionQuery): Observable<any> {
    const query = this._sqlService.createUnionQuery(sqlQuery);
    console.log('query', query);
    return this._createObservableFromQuery(query);
  }

  public rawQuery(sql: string): Observable<any> {
    return this._createObservableFromQuery(sql);
  }

  private _createObservableFromQuery(
    sqlQuery: any,
    values?: any
  ): Observable<any> {
    const result = new Subject();

    this._sqlService.runQuery(sqlQuery, values).subscribe({
      next: (response) => result.next(response),
      error: (err) => this._handleError(err),
    });

    return result.asObservable();
  }

  private _handleError(err: any) {
    console.error(err);
  }
}
