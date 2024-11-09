import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const Configuration_File = 'config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config:any;

  constructor(private readonly http: HttpClient) { }

  public getConfig<T>(key: string): T{
    return this.config[key];
  }

  public getSettings(): Promise<Object> {
    return firstValueFrom(this.http.get(Configuration_File)).then((settings: any) => {
      this.config = settings;
      return settings;
    });
  }
}
