import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Xttsv2Service {
  private url: string = "http://127.0.0.1:5000/api";
  private endpointTtsToFile: string = "tts-to-file";

  constructor(private http: HttpClient) { }

  public async postTtsToFile(data: Object, next?: ((value: any) => void), error?: ((err: any) => void)): Promise<any> {
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
}