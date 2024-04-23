import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class Xttsv2Service {
  private url: string = "http://127.0.0.1:5000/api";
  private endpointTtsToFile: string = "tts-to-file";
  private endpointTtsGetWav = "get-wav";
  private endpointTtsGetWaves = "get-waves";

  constructor(private http: HttpClient) { }

  public async postTtsToFile(data: Object, next?: ((value: any) => void), error?: ((err: any) => void)): Promise<void> {
    const url = `${this.url}/${this.endpointTtsToFile}`;
    this.http.post<any>(url, data).subscribe({
      next: value => {
        if (next !== undefined) {
          next(value);
        }
      },
      error: err => {
        if (error != undefined) {
          error(err);
        }
      }
    });
  }

  public async getWav(filePath: string): Promise<string> {
    return `${this.url}/${this.endpointTtsGetWav}?filePath=${filePath}`;
  }

  public async getWaves(next?: ((value: any) => void), error?: ((err: any) => void)): Promise<void> {
    const url = `${this.url}/${this.endpointTtsGetWaves}`;
    this.http.get<any>(url).subscribe({
      next: value => {
        if (next !== undefined) {
          next(value);
        }
      },
      error: err => {
        if (error != undefined) {
          error(err);
        }
      }
    });
  }
}