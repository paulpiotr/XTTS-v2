import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { Xttsv2Service } from '../../shared/services';
import notify from 'devextreme/ui/notify';
import { map } from 'rxjs/operators'

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {
  loading: boolean = false;
  employee: any;
  colCountByScreen: object;
  formData: any = {};

  constructor(private xttsv2Service: Xttsv2Service) {
    this.formData = {
      Language: 'en',
      SpeakerWav: 'XTTS-v2/samples/en_sample.wav',
      Text: 'TTS is a Voice generation model that lets you clone voices into different languages by using just a quick 6-second audio clip. There is no need for an excessive amount of training data that spans countless hours.',
      Temperature: 0.85,
      LengthPenalty: 1.0,
      RepetitionPenalty: 2.0,
      TopK: 50,
      TopP: 0.85,
      NumGptOutputs: 1,
      Notes: 'TTS is a Voice generation model that lets you clone voices into different languages by using just a quick 6-second audio clip. There is no need for an excessive amount of training data that spans countless hours.',
    };
    this.colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    };
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    this.loading = true;
    const result = this.xttsv2Service.postTtsToFile(this.formData, (value) => { 
      this.loading = false;
      console.log(value);
      notify(`Done ${value.filePath}`, 'success', 7000);
     }, (err) => {
      this.loading = false;
      console.log(err);
      notify(err, 'error', 7000);
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule
  ],
  declarations: [ProfileComponent],
  exports: [ProfileComponent]
})
export class ProfileCodule { }