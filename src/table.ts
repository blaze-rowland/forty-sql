import { lastValueFrom, Observable } from 'rxjs';
import {
  AlterQuery,
  ColumnKeyValue,
  CreateQuery,
  DeleteQuery,
  FindQuery,
  JoinQuery,
  UnionQuery,
  UpdateQuery,
} from './models/sql.model';
import { TableService } from './services/table.service';

export abstract class Table<T> {
  public tableName: string;
  public schema: T;
  public dataset: Array<T>;
  public columns: Array<string>;
  public tableService: TableService;

  constructor(tableName: string, schema: any, dataset: Array<T> = []) {
    this.tableName = tableName;
    this.schema = schema;
    this.dataset = dataset;
    this.columns = Object.keys(new schema());

    this.tableService = new TableService(this.tableName);
  }

  public find(query?: FindQuery): Observable<Array<T>> {
    return this.tableService.find(query).run();
  }

  public findAsync(query?: FindQuery): Promise<Array<T>> {
    return lastValueFrom(this.find(query));
  }

  public findOne(query: FindQuery): Observable<T> {
    return this.tableService.findOne(query).run();
  }

  public findOneAsync(query: FindQuery): Promise<T> {
    return lastValueFrom(this.findOne(query));
  }

  public findAmount(query: FindQuery, amount: number): Observable<T> {
    return this.tableService.findAmount(query, amount).run();
  }

  public findAmountAsync(query: FindQuery, amount: number): Promise<T> {
    return lastValueFrom(this.findAmount(query, amount));
  }

  public insert(values: ColumnKeyValue): Observable<any> {
    return this.tableService.insert().run(values);
  }

  public insertAsync(values: ColumnKeyValue): Promise<any> {
    return lastValueFrom(this.insert(values));
  }

  public update(query: UpdateQuery): Observable<any> {
    return this.tableService.update(query).run(query.values);
  }

  public updateAsync(query: UpdateQuery): Promise<any> {
    return lastValueFrom(this.update(query));
  }

  public delete(query: DeleteQuery): Observable<any> {
    return this.tableService.delete(query).run();
  }

  public deleteAsync(query: DeleteQuery): Promise<any> {
    return lastValueFrom(this.delete(query));
  }

  public create(config: CreateQuery): Observable<any> {
    return this.tableService.create(config).run();
  }

  public createAsync(config: CreateQuery): Promise<any> {
    return lastValueFrom(this.create(config));
  }

  public alter(config: AlterQuery): Observable<any> {
    return this.tableService.alter(config).run();
  }

  public alterAsync(config: AlterQuery): Promise<any> {
    return lastValueFrom(this.alter(config));
  }

  public union(config: UnionQuery): Observable<any> {
    return this.tableService.union(config).run();
  }

  public unionAsync(config: UnionQuery): Promise<any> {
    return lastValueFrom(this.union(config));
  }

  public join(config: JoinQuery): Observable<any> {
    return this.tableService.join(config).run();
  }

  public joinAsync(config: JoinQuery): Promise<any> {
    return lastValueFrom(this.join(config));
  }

  public drop(): Observable<any> {
    return this.tableService.drop().run();
  }

  public dropAsync(): Promise<any> {
    return lastValueFrom(this.drop());
  }
}
