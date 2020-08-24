import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  maxDate;
  isloading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<{ui: fromRoot.State}>
  ) {}

  ngOnInit() {
    this.isloading$ = this.store.select(fromRoot.getIsLoading);

    /*this.loadingSubscription = this.uiService.loadingStateChanged
      .subscribe(isLoading => {
        this.isloading = isLoading;
      });*/

    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }
}
