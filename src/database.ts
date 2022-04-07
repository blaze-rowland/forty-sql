import { lastValueFrom, Observable } from 'rxjs';
import { DatabaseService } from './services/database.service';

export class Database {
  databaseName: string;
  databaseService: DatabaseService;

  constructor(databaseName: string) {
    this.databaseName = databaseName;
    this.databaseService = new DatabaseService(this.databaseName);
  }

  public create(): void {
    const initialDb = this.databaseService.databaseConfig.database;
    this.databaseService.setDatabase = undefined;
    this.databaseService.create().run();
    this.databaseService.setDatabase = initialDb;
  }

  public switch(databaseName?: string): void {
    this.databaseService.setDatabase = databaseName || this.databaseName;
  }

  public delete(databaseName?: string): Observable<any> {
    return this.databaseService.delete(databaseName).run();
  }

  public deleteAsync(databaseName?: string): Promise<any> {
    return lastValueFrom(this.delete(databaseName));
  }
}
