import { DatabaseService } from '../services/database.service';
import { Query } from './query';

export class DatabaseQuery extends Query {
  private _databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    super();
    this._databaseService = databaseService;
  }

  create(): DatabaseQuery {
    const qb = this.query;

    qb.push(
      'CREATE DATABASE IF NOT EXISTS',
      this._databaseService.databaseName
    );
    this.setQuery = qb;

    return this;
  }

  delete(databaseName?: string): DatabaseQuery {
    const qb = this.query;

    if (
      this._databaseService.databaseName ===
      this._databaseService.databaseConfig.database
    ) {
      console.error(
        'Cannot drop database that is in use. Please switch databases before deleting.'
      );
      return this;
    }

    qb.push(
      'DROP DATABASE IF EXISTS',
      databaseName || this._databaseService.databaseName
    );
    this.setQuery = qb;

    return this;
  }
}
