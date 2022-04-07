import { createPool, Pool } from 'mysql2';

export interface DatabaseConfig {
  host: string | undefined;
  port: number | undefined;
  database: string | undefined;
  user: string | undefined;
  password: string | undefined;
}

export class SqlService {
  public pool: Pool;
  private _databaseConfig: DatabaseConfig = {
    host: process.env.FORTY_HOST,
    port: parseInt(process.env.FORTY_PORT || ''),
    database: process.env.FORTY_DB || undefined,
    user: process.env.FORTY_USER,
    password: process.env.FORTY_PASS,
  };

  get databaseConfig(): DatabaseConfig {
    return this._databaseConfig;
  }

  set setHost(host: string) {
    this._databaseConfig.host = host;
    this._reconnect();
  }

  set setPort(port: number) {
    this._databaseConfig.port = port;
    this._reconnect();
  }

  set setDatabase(database: string | undefined) {
    this._databaseConfig.database = database;
    this._reconnect();
  }

  set setUser(user: string) {
    this._databaseConfig.user = user;
    this._reconnect();
  }

  set setPassword(password: string) {
    this._databaseConfig.password = password;
    this._reconnect();
  }

  constructor() {
    this.pool = createPool(this._databaseConfig);
  }

  databaseConnected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.pool.getConnection((err, connection) => {
          if (err) return reject(false);

          connection.release();
          resolve(true);
        });
      } catch (err) {
        console.error(err);
        return reject(false);
      }
    });
  }

  private _reconnect(): void {
    this.pool = createPool(this._databaseConfig);
  }
}
