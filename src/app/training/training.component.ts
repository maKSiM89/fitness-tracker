import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as fromTraining from './training.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  ongoingTraining$: Observable<boolean>;

  constructor(private store: Store<fromTraining.State>) {}

  ngOnInit() {
    /*this.exerciseSubscription = this.trainingService.exerciseChanged$
      .subscribe((exercise) => this.ongoingTraining = !!exercise);*/
    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);
  }
}
