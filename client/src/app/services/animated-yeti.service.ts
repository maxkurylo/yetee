import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AnimatedYetiService {
  public startBlinking$ = new Subject<Delay>();
  public stopBlinking$ = new Subject<void>();

  public resetFace$ = new Subject<void>();

  public coverEyes$ = new Subject<void>();
  public uncoverEyes$ = new Subject<void>();

  public spreadFingers$ = new Subject<void>();
  public closeFingers$ = new Subject<void>();

  public setMouthState$ = new Subject<MouthState>();

  public lookAtPoint$ = new Subject<Coordinates>();

  constructor() { }

}


type Delay = number;

export enum MouthState {
  'SMALL',
  'MEDIUM',
  'LARGE'
}

export interface Coordinates {
  x: number;
  y: number;
}
