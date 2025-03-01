// aos.service.ts
import { Injectable } from '@angular/core';
import * as AOS from 'aos';

@Injectable({
  providedIn: 'root'
})
export class AosService {
  initialize() {
    AOS.init({
      // Global settings
      duration: 1000,
      easing: 'ease-in-out',
      once: false // Set to false to repeat animations
    });
  }

  refresh() {
    AOS.refresh();
  }
}
