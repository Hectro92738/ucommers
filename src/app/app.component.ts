import { Component } from '@angular/core';
import { SpinnerService } from './services/spinner.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    standalone: false
})
export class AppComponent {
  loading$ = this.spinnerService.loading$;
  constructor(private spinnerService: SpinnerService) {}
}
