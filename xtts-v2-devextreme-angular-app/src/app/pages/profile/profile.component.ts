import { CommonModule } from '@angular/common';
import { Component, NgModule, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxButtonModule } from 'devextreme-angular';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { Xttsv2Service } from '../../shared/services';
import notify from 'devextreme/ui/notify';
import { NgxAudioControlComponent, NgxAudioControlModule, PlayList } from 'ngx-audio-control';

@Component({
  selector: 'app-root',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {
  loading: boolean = false;
  employee: any;
  colCountByScreen: object;
  formData: any = {};
  files: any = [];

  @ViewChild(NgxAudioControlComponent) angxAudioControl: NgxAudioControlComponent | undefined;

  constructor(private xttsv2Service: Xttsv2Service, private el: ElementRef) {
    this.formData = {
      Language: 'en',
      SpeakerWav: '../XTTS-v2/samples/en_sample.wav',
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

  public async getWaves(): Promise<void> {
    this.loading = true;
    await this.xttsv2Service.getWaves(async (value) => {
      this.loading = false;
      (Object.keys(value) as (keyof typeof value)[]).forEach(async (key, index) => {
        const wavFilePath = await this.xttsv2Service.getWav(value[key].WavFilePath);
        const playList = new PlayList();
        playList.title = value[key].Basename;
        playList.fileAddress = wavFilePath;
        const find = this.angxAudioControl?.audioFiles.find((obj) => {
          return obj.title === playList.title;
        });
        if (find === undefined) {
          this.angxAudioControl?.audioFiles.push(playList);
        }
      });
      notify(`Done`, 'success', 7000);
    }, (err) => {
      this.loading = false;
      console.log(err.error.currentTarget);
      notify('Błąd!', 'error', 7000);
    });
  }

  async ngOnInit() {
    this.getWaves();
  }

  async onSubmit(e: Event) {
    e.preventDefault();
    this.loading = true;
    await this.xttsv2Service.postTtsToFile(this.formData, async (value) => {
      this.loading = false;
      console.log(value);
      const wavFilePath = await this.xttsv2Service.getWav(value.WavFilePath);
      await this.getWaves();
      notify(`Done ${wavFilePath}`, 'success', 7000);
    }, (err) => {
      this.loading = false;
      console.log(err.error.currentTarget);
      notify('Błąd!', 'error', 7000);
    });
  }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxButtonModule,
    DxLoadIndicatorModule,
    NgxAudioControlModule
  ],
  declarations: [ProfileComponent],
  exports: [ProfileComponent]
})

export class ProfileModule { }