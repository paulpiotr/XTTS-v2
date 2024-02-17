import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class XttsService {
    private url: string = "http://127.0.0.1:5000/api";
    private endpointTtsToFile: string = "tts-to-file";

    constructor(private httpClient: HttpClient) { }

    public async postTtsToFile(data: Object): Promise<Observable<Object>> {
        return this.httpClient.post(`${this.url}/${this.endpointTtsToFile}`, data);
    }
}