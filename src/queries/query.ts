import { Observable, Subject } from 'rxjs';
import { ColumnKeyValue } from '../models/sql.model';
import { SqlService } from '../services/sql.service';

export abstract class Query {
  private _sqlService = new SqlService();
  public query: Array<unknown> = [];
  public limitAmount: number | undefined;

  set setQuery(query: Array<unknown>) {
    this.query = query;
  }

  constructor() {}

  public run(
    values?: ColumnKeyValue | null,
    queryOverride?: string
  ): Observable<any> {
    const response = new Subject();
    const query = this.queryBuilder(this.query);
    this._sqlService.pool.query(
      queryOverride || query,
      values,
      (err: any, result: Array<any>) => {
        if (err) console.error(err);

        if (this.limitAmount === 1) {
          response.next(result[0]);
        } else {
          response.next(result);
        }
      }
    );

    return response.asObservable();
  }

  public queryBuilder(query: Array<unknown>): string {
    return query.join(' ');
  }

  public addIfNotLastIteration(
    arr: Array<unknown> = [],
    index: number,
    str: string
  ): string | void {
    if (!arr.length || index === arr.length - 1) return;
    return str;
  }
}
