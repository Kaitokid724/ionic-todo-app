import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FirebaseService } from './services/firebase.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private firebase: FirebaseService) {}

  async ngOnInit(): Promise<void> {
    // Initialize Firebase + Remote Config on app start
    await this.firebase.initialize();
  }
}
