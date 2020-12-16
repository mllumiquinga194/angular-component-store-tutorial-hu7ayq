import { Injectable } from "@angular/core";

import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { EMPTY, Observable } from "rxjs";
import { catchError, concatMap, tap } from "rxjs/operators";
import { Car } from "./models/car";
import { ParkingLotService } from "./services/parking-lot.service";

export const enum LoadingState {
  INIT = "INIT",
  LOADING = "LOADING",
  LOADED = "LOADED"
}
export interface ErrorState {
  errorMsg: string;
}

export type CallState = LoadingState | ErrorState;

// The state model
interface ParkingState {
  cars: Car[]; // render the table with cars
  callState: CallState;
}

// Utility function to extract the error from the state
function getError(callState: CallState): LoadingState | string | null {
  if ((callState as ErrorState).errorMsg !== undefined) {
    return (callState as ErrorState).errorMsg;
  }

  return null;
}

@Injectable()
export class StoreService extends ComponentStore<ParkingState> {
  constructor(private parkingLotService: ParkingLotService) {
    super({
      cars: [],
      callState: LoadingState.INIT
    });
  }

  // SELECTORS
  private readonly cars$: Observable<Car[]> = this.select(state => state.cars);
  private readonly loading$: Observable<boolean> = this.select(
    state => state.callState === LoadingState.LOADING
  );
  private readonly error$: Observable<string> = this.select(state =>
    getError(state.callState)
  );

  // ViewModel for the component
  readonly vm$ = this.select(
    this.cars$,
    this.loading$,
    this.error$,
    (cars, loading, error) => ({
      cars,
      loading,
      error
    })
  );

  // UPDATERS
  readonly updateError = this.updater((state: ParkingState, error: string) => {
    return {
      ...state,
      callState: {
        errorMsg: error
      }
    };
  });

  readonly setLoading = this.updater((state: ParkingState) => {
    return {
      ...state,
      callState: LoadingState.LOADING
    };
  });

  readonly setLoaded = this.updater((state: ParkingState) => {
    return {
      ...state,
      callState: LoadingState.LOADED
    };
  });

  readonly updateCars = this.updater((state: ParkingState, car: Car) => {
    return {
      ...state,
      cars: [...state.cars, car]
    };
  });

  // EFFECTS
  readonly addCarToParkingLot = this.effect((plate$: Observable<string>) => {
    return plate$.pipe(
      concatMap((plate: string) => {
        this.setLoading();
        return this.parkingLotService.add(plate).pipe(
          tapResponse(
            car => {
              this.setLoaded();
              this.updateCars(car);
            },
            (e: string) => this.updateError(e)
          ),
          catchError(() => EMPTY)
        );
      })
    );
  });
}
