import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AnimatedYetiService, Coordinates, MouthState} from "../../services/animated-yeti.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import gsap, { Quad, Expo, Power2 } from 'gsap';

@Component({
    selector: 'app-animated-yeti',
    templateUrl: './animated-yeti.component.html',
    styleUrls: ['./animated-yeti.component.scss']
})
export class AnimatedYetiComponent implements OnInit, OnDestroy {
    @ViewChild('mySVG', {static: true}) mySVG: ElementRef;
    @ViewChild('twoFingers', {static: true}) twoFingers: ElementRef;
    @ViewChild('armL', {static: true}) armL: ElementRef;
    @ViewChild('armR', {static: true}) armR: ElementRef;
    @ViewChild('eyeL', {static: true}) eyeL: ElementRef;
    @ViewChild('eyeR', {static: true}) eyeR: ElementRef;
    @ViewChild('nose', {static: true}) nose: ElementRef;
    @ViewChild('mouth', {static: true}) mouth: ElementRef;
    @ViewChild('mouthBG', {static: true}) mouthBG: ElementRef;
    @ViewChild('mouthSmallBG', {static: true}) mouthSmallBG: ElementRef;
    @ViewChild('mouthMediumBG', {static: true}) mouthMediumBG: ElementRef;
    @ViewChild('mouthLargeBG', {static: true}) mouthLargeBG: ElementRef;
    @ViewChild('mouthMaskPath', {static: true}) mouthMaskPath: ElementRef;
    @ViewChild('mouthOutline', {static: true}) mouthOutline: ElementRef;
    @ViewChild('tooth', {static: true}) tooth: ElementRef;
    @ViewChild('tongue', {static: true}) tongue: ElementRef;
    @ViewChild('chin', {static: true}) chin: ElementRef;
    @ViewChild('face', {static: true}) face: ElementRef;
    @ViewChild('hair', {static: true}) hair: ElementRef;
    @ViewChild('eyebrow', {static: true}) eyebrow: ElementRef;
    @ViewChild('bodyBG', {static: true}) bodyBG: ElementRef;
    @ViewChild('bodyBGchanged', {static: true}) bodyBGchanged: ElementRef;
    @ViewChild('outerEarL', {static: true}) outerEarL: ElementRef;
    @ViewChild('outerEarR', {static: true}) outerEarR: ElementRef;
    @ViewChild('earHairL', {static: true}) earHairL: ElementRef;
    @ViewChild('earHairR', {static: true}) earHairR: ElementRef;

    private eyeScale: number = 1;

    private blinking: any;

    private svgCoords: Coordinates;
    private eyeLCoords: Coordinates;
    private eyeRCoords: Coordinates;
    private noseCoords: Coordinates;
    private mouthCoords: Coordinates;

    private destroyed$ = new Subject<void>();

    constructor(private ays: AnimatedYetiService) {
    }

    ngOnInit(): void {
        // some measurements for the svg's elements
        this.svgCoords = this.getCoordinates(this.mySVG.nativeElement);
        this.eyeLCoords = { x: this.svgCoords.x + 84, y: this.svgCoords.y + 76 };
        this.eyeRCoords = { x: this.svgCoords.x + 113, y: this.svgCoords.y + 76 };
        this.noseCoords = { x: this.svgCoords.x + 97, y: this.svgCoords.y + 81 };
        this.mouthCoords = { x: this.svgCoords.x + 100, y: this.svgCoords.y + 100 };

        // move arms to initial positions
        gsap.set(this.armL.nativeElement, { x: -93, y: 220, rotation: 105, transformOrigin: "top left" });
        gsap.set(this.armR.nativeElement, { x: -93, y: 220, rotation: -105, transformOrigin: "top right" });

        // set initial mouth property (fixes positioning bug)
        gsap.set(this.mouth.nativeElement, { transformOrigin: "center center" });

        this.ays.startBlinking$.pipe(takeUntil(this.destroyed$)).subscribe((delay: number) => {
            this.startBlinking(delay);
        });
        this.ays.stopBlinking$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.stopBlinking();
        });
        this.ays.coverEyes$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.coverEyes();
        });
        this.ays.uncoverEyes$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.uncoverEyes();
        });
        this.ays.spreadFingers$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.spreadFingers();
        });
        this.ays.closeFingers$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.closeFingers();
        });
        this.ays.resetFace$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.resetFace();
        });
        this.ays.lookAtPoint$.pipe(takeUntil(this.destroyed$)).subscribe((point: Coordinates) => {
            this.lookAtPoint(point);
        });

        // DOESN'T WORK!
        this.ays.setMouthState$.pipe(takeUntil(this.destroyed$)).subscribe((mouthState: MouthState) => {
            this.setMouthState(mouthState);
        });
    }

    private lookAtPoint(point: Coordinates) {
        const CHIN_MIN = 0.5;
        const screenCenter = this.svgCoords.x + (this.mySVG.nativeElement.clientWidth / 2);

        const dFromC = screenCenter - point.x;
        const eyeLAngle = this.getAngle(this.eyeLCoords.x, this.eyeLCoords.y, point.x, point.y + 25);
        const eyeRAngle = this.getAngle(this.eyeRCoords.x, this.eyeRCoords.y, point.x, point.y + 25);
        const noseAngle = this.getAngle(this.noseCoords.x, this.noseCoords.y, point.x, point.y + 25);
        const mouthAngle = this.getAngle(this.mouthCoords.x, this.mouthCoords.y, point.x, point.y + 25);

        const eyeLX = Math.cos(eyeLAngle) * 20;
        const eyeLY = Math.sin(eyeLAngle) * 10;
        const eyeRX = Math.cos(eyeRAngle) * 20;
        const eyeRY = Math.sin(eyeRAngle) * 10;
        const noseX = Math.cos(noseAngle) * 23;
        const noseY = Math.sin(noseAngle) * 10;
        const mouthX = Math.cos(mouthAngle) * 23;
        const mouthY = Math.sin(mouthAngle) * 10;
        const mouthR = Math.cos(mouthAngle) * 6;
        const chinX = mouthX * .8;
        const chinY = mouthY * .5;

        let chinS = 1 - ((dFromC * .15) / 100);
        if (chinS > 1) {
            chinS = 1 - (chinS - 1);
            if(chinS < CHIN_MIN) {
                chinS = CHIN_MIN;
            }
        }

        const faceX = mouthX * .3;
        const faceY = mouthY * .4;
        const faceSkew = Math.cos(mouthAngle) * 5;
        const eyebrowSkew = Math.cos(mouthAngle) * 25;
        const outerEarX = Math.cos(mouthAngle) * 4;
        const outerEarY = Math.cos(mouthAngle) * 5;
        const hairX = Math.cos(mouthAngle) * 6;
        const hairS = 1.2;

        gsap.to(this.eyeL.nativeElement, 1, { x: -eyeLX , y: -eyeLY, ease: Expo.easeOut });
        gsap.to(this.eyeR.nativeElement, 1, { x: -eyeRX , y: -eyeRY, ease: Expo.easeOut });
        gsap.to(this.nose.nativeElement, 1, { x: -noseX, y: -noseY, rotation: mouthR, transformOrigin: "center center", ease: Expo.easeOut });
        gsap.to(this.mouth.nativeElement, 1, { x: -mouthX , y: -mouthY, rotation: mouthR, transformOrigin: "center center", ease: Expo.easeOut });
        gsap.to(this.chin.nativeElement, 1, { x: -chinX, y: -chinY, scaleY: chinS, ease: Expo.easeOut });
        gsap.to(this.face.nativeElement, 1, { x: -faceX, y: -faceY, skewX: -faceSkew, transformOrigin: "center top", ease: Expo.easeOut });
        gsap.to(this.eyebrow.nativeElement, 1, { x: -faceX, y: -faceY, skewX: -eyebrowSkew, transformOrigin: "center top", ease: Expo.easeOut });
        gsap.to(this.outerEarL.nativeElement, 1, { x: outerEarX, y: -outerEarY, ease: Expo.easeOut });
        gsap.to(this.outerEarR.nativeElement, 1, { x: outerEarX, y: outerEarY, ease: Expo.easeOut });
        gsap.to(this.earHairL.nativeElement, 1, { x: -outerEarX, y: -outerEarY, ease: Expo.easeOut });
        gsap.to(this.earHairR.nativeElement, 1, { x: -outerEarX, y: outerEarY, ease: Expo.easeOut });
        gsap.to(this.hair.nativeElement, 1, { x: hairX, scaleY: hairS, transformOrigin: "center bottom", ease: Expo.easeOut });
    }

    private setMouthState(mouthState: MouthState) {
        if (mouthState == MouthState.SMALL) {
            // DOESN'T WORK mouth open
            gsap.to([this.mouthBG.nativeElement, this.mouthOutline.nativeElement, this.mouthMaskPath.nativeElement], 1, { morphSVG: this.mouthSmallBG.nativeElement, shapeIndex: 9, ease: Expo.easeOut });
            gsap.to(this.tooth.nativeElement, 1, {x: 0, y: 0, ease: Expo.easeOut});
            gsap.to(this.tongue.nativeElement, 1, {y: 0, ease: Expo.easeOut});
            gsap.to([this.eyeL.nativeElement, this.eyeR.nativeElement], 1, {scaleX: 1, scaleY: 1, ease: Expo.easeOut});
            this.eyeScale = 1;
        }
        if (mouthState === MouthState.MEDIUM) {
            // DOESN'T WORK mouth open
            gsap.to([this.mouthBG.nativeElement, this.mouthOutline.nativeElement, this.mouthMaskPath.nativeElement], 1, { morphSVG: this.mouthMediumBG.nativeElement, shapeIndex: 8, ease: Expo.easeOut });
            gsap.to(this.tooth.nativeElement, 1, {x: 0, y: 0, ease: Expo.easeOut});
            gsap.to(this.tongue.nativeElement, 1, {x: 0, y: 1, ease: Expo.easeOut});
            gsap.to([this.eyeL.nativeElement, this.eyeR.nativeElement], 1, { scaleX: .85, scaleY: .85, ease: Expo.easeOut });
            this.eyeScale = .85;
        }
        if (mouthState === MouthState.LARGE) {
            // DOESN'T WORK mouth open
            gsap.to([this.mouthBG.nativeElement, this.mouthOutline.nativeElement, this.mouthMaskPath.nativeElement], 1, {morphSVG: this.mouthLargeBG.nativeElement, ease: Expo.easeOut});
            gsap.to(this.tooth.nativeElement, 1, { x: 3, y: -2, ease: Expo.easeOut });
            gsap.to(this.tongue.nativeElement, 1, { y: 2, ease: Expo.easeOut });
            gsap.to([this.eyeL.nativeElement, this.eyeR.nativeElement], 1, { scaleX: .65, scaleY: .65, ease: Expo.easeOut, transformOrigin: "center center" });
            this.eyeScale = .65;
        }
    }

    private spreadFingers() {
        gsap.to(this.twoFingers.nativeElement, .35, { transformOrigin: "bottom left", rotation: 30, x: -9, y: -2, ease: Power2.easeInOut });
    }

    private closeFingers() {
        gsap.to(this.twoFingers.nativeElement, .35, { transformOrigin: "bottom left", rotation: 0, x: 0, y: 0, ease: Power2.easeInOut });
    }

    private coverEyes() {
        gsap.killTweensOf([this.armL.nativeElement, this.armR.nativeElement]);
        gsap.set([this.armL.nativeElement, this.armR.nativeElement], { visibility: "visible" });
        gsap.to(this.armL.nativeElement, .45, { x: -93, y: 10, rotation: 0, ease: Quad.easeOut});
        gsap.to(this.armR.nativeElement, .45, { x: -93, y: 10, rotation: 0, ease: Quad.easeOut, delay: .1 });
        // DOESN'T WORK shoulders moved from circle to straight
        gsap.to(this.bodyBG.nativeElement, .45, { morphSVG: this.bodyBGchanged.nativeElement, ease: Quad.easeOut });
    }

    private uncoverEyes() {
        gsap.killTweensOf([this.armL.nativeElement, this.armR.nativeElement]);
        gsap.to(this.armL.nativeElement, 1.35, { y: 220, ease: Quad.easeOut});
        gsap.to(this.armL.nativeElement, 1.35, { rotation: 105, ease: Quad.easeOut, delay: .1});
        gsap.to(this.armR.nativeElement, 1.35, { y: 220, ease: Quad.easeOut});
        gsap.to(this.armR.nativeElement, 1.35, { rotation: -105, ease: Quad.easeOut, delay: .1, onComplete: () => {
            gsap.set([this.armL.nativeElement, this.armR.nativeElement], { visibility: "hidden" });
        }});
        // DOESN'T WORK shoulders moved from straight to circle
        gsap.to(this.bodyBG.nativeElement, .45, { morphSVG: this.bodyBG.nativeElement, ease: Quad.easeOut });
    }

    private resetFace() {
        gsap.to([this.eyeL.nativeElement, this.eyeR.nativeElement], 1, { x: 0, y: 0, ease: Expo.easeOut });
        gsap.to(this.nose.nativeElement, 1, { x: 0, y: 0, scaleX: 1, scaleY: 1, ease: Expo.easeOut });
        gsap.to(this.mouth.nativeElement, 1, { x: 0, y: 0, rotation: 0, ease: Expo.easeOut });
        gsap.to(this.chin.nativeElement, 1, { x: 0, y: 0, scaleY: 1, ease: Expo.easeOut });
        gsap.to([this.face.nativeElement, this.eyebrow.nativeElement], 1, { x: 0, y: 0, skewX: 0, ease: Expo.easeOut });
        gsap.to([this.outerEarL.nativeElement, this.outerEarR.nativeElement, this.earHairL.nativeElement, this.earHairR.nativeElement, this.hair.nativeElement], 1, { x: 0, y: 0, scaleY: 1, ease: Expo.easeOut });
    }

    private startBlinking(delay: number = 1) {
        if (delay > 1) {
            // randomize delay
            delay = Math.floor(Math.random() * Math.floor(delay));
        } else {
            delay = 1;
        }
        this.blinking = gsap.to([this.eyeL.nativeElement, this.eyeR.nativeElement], .1, { delay: delay, scaleY: 0, yoyo: true, repeat: 1, transformOrigin: "center center", onComplete: () => {
            this.startBlinking(10);
        }});
    }

    private stopBlinking() {
        this.blinking?.kill();
        this.blinking = null;
        gsap.set([this.eyeL.nativeElement, this.eyeR.nativeElement], { scaleY: this.eyeScale });
    }

    private getAngle(x1: number, y1: number, x2: number, y2: number) {
        return Math.atan2(y1 - y2, x1 - x2);
    }

    private getCoordinates(element: any): Coordinates {
        const rect = element.getBoundingClientRect();
        return { x: rect.x, y: rect.y };
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
