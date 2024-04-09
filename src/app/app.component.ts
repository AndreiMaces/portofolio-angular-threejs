import {Component, ViewChild} from '@angular/core';
import {EnvironmentService} from "./core/environment/environment.service";
import {HandlerService} from "./core/handler.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Portofolio';
  @ViewChild('progressBar') progressBar: any;
  @ViewChild('progressLabel') progressLabel: any;

  constructor(private environmentService: EnvironmentService, private handlerService: HandlerService) {}
  ngAfterViewInit() {
    this.initialize();
  }

  initialize() {
    this.environmentService.initializeEnvironment();
    this.environmentService.setProgressBar(this.progressBar.nativeElement);
    this.environmentService.setProgressLabel(this.progressLabel.nativeElement);
    this.handlerService.initialize();
  }
}
