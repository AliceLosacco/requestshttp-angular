import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnviarValorService {

  privateemissor$ = new Subject<string>()

  emitirValor(valor: string) {
   this.privateemissor$.next(valor)
  }

  getValor() {
    return this.privateemissor$.asObservable()
  }

}
