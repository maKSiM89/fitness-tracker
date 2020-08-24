import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Exercise} from '../training.interface';
import {TrainingService} from '../training.service';
import * as fromTraining from './../training.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;

  displayedColumns: string[] = [
    'date',
    'name',
    'duration',
    'calories',
    'state'
  ];
  dataSource = new MatTableDataSource<Exercise>();

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.trainingService.fetchFinishedExercises();
    this.store.select(fromTraining.getFinishedExercises)
      .subscribe(exercises => {
        this.dataSource.data = exercises;
      });

    /*this.exercisesSubscription = this.trainingService.finishedExercisesChanged$
      .subscribe((exercises: Exercise[]) => {
        this.dataSource.data = exercises;
      });*/
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  doFilter(filter: string) {
    this.dataSource.filter = filter.trim().toLowerCase();
  }
}
