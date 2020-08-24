import {Exercise} from './training.interface';
import {Injectable} from '@angular/core';
import {map, take} from 'rxjs/operators';
import {AngularFirestore} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';
import {UIService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private firebaseSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchFinishedExercises() {
    const subscription = this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        // this._finishedExercises = exercises;
        // this.finishedExercisesChanged$.next(exercises);
        this.store.dispatch(new Training.SetFinishedExercises(exercises));
      });

    this.firebaseSubscriptions.push(subscription);
  }

  fetchAvailableExercises() {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());

    const subscription = this.db.collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map(docArray => docArray.map(doc => {
          const data = doc.payload.doc.data();

          return {
            id: doc.payload.doc.id,
            name: data['name'],
            duration: data['duration'],
            calories: data['calories']
          };
        }))
      )
      .subscribe((exercises: Exercise[]) => {
        // this._availableExercises = exercises;
        // this.uiService.loadingStateChanged.next(false);
        // this.exercisesChanged$.next([...this._availableExercises]);
        this.store.dispatch(new Training.SetAvailableExercises(exercises));
        this.store.dispatch(new UI.StopLoading());
      }, error => {
        this.uiService.showSnackbar(
          'Fetching exercises failed, please try again later!',
          null,
          3000
        );
        // this.exercisesChanged$.next(null);
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      });

    this.firebaseSubscriptions.push(subscription);
  }

  cancelSubscriptions() {
    this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
  }

  startExercise(id: string) {
    // this._runningExercise = this._availableExercises.find(exercise => exercise.id === id);
    // this.exerciseChanged$.next({...this._runningExercise});
    this.store.dispatch(new Training.StartTraining(id));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(exercise => {
        this.addDataToDB({
          ...exercise,
          date: new Date(),
          state: 'completed'
        });

        /*this._runningExercise = null;
        this.exerciseChanged$.next(null);*/
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(exercise => {
        this.addDataToDB({
          ...exercise,
          date: new Date(),
          state: 'cancelled',
          duration: exercise.duration * (progress / 100),
          calories: exercise.calories * (progress / 100),
        });

        /*this._runningExercise = null;
        this.exerciseChanged$.next(null);*/
        this.store.dispatch(new Training.StopTraining());
      });
  }

  private addDataToDB(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
