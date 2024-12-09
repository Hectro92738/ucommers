import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Base64Service {
  constructor() {}

  encode(str: string): string {
    return btoa(str);
  }

  decode(str: string): string {
    return atob(str);
  }
}
