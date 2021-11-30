import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';
import { Curso } from '../curso';
import { CursosService } from '../cursos.service';
import { Cursos2Service } from '../cursos2.service';

@Component({
  selector: 'app-cursos-lista',
  templateUrl: './cursos-lista.component.html',
  styleUrls: ['./cursos-lista.component.scss'],
  preserveWhitespaces: true
})
export class CursosListaComponent implements OnInit {

  deleteModalRef!: BsModalRef

  @ViewChild('deleteModal') deleteModal: any

  cursos$!: Observable<Curso[]>

  error$ = new Subject<boolean>()

  cursoSelecionado!: Curso

  bsModalRef!: BsModalRef

  constructor(
      private service: Cursos2Service, 
      private alertService: AlertModalService,
      private modalService: BsModalService,
      private router: Router,
      private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.onRefresh()
  }

  onRefresh() {
    this.cursos$ = this.service.list()
    .pipe(
        catchError(error => {
          console.error(error)
          //this.error$.next(true)
          this.handleError()
          return EMPTY
        })
    )
    this.service.list().subscribe
  }

  handleError() {
    this.alertService.showAlertDanger('Erro ao carregar cursos. Tente novamente mais tarde.')
  }

  onEdit(id: any) {
    this.router.navigate(['editar', id], { relativeTo: this.route })
  }

  onDelete(curso: Curso) {
    this.cursoSelecionado = curso
    const result$ = this.alertService.showConfirm('Confirmação', 'Tem certeza que deseja remover esse curso?')
    result$.asObservable()
    .pipe(
      take(1),
      switchMap(result => result ? this.service.remove(curso.id!) : EMPTY)
    )
    .subscribe(
      success => {
        this.onRefresh()
      },
      error => {
        this.alertService.showAlertDanger('Erro ao remover curso. Tente novamente mais tarde')
      })
  }

  onConfirmDelete() {
    this.service.remove(this.cursoSelecionado.id!)
    .subscribe(
      success => {
        this.onRefresh()
        this.deleteModalRef.hide()
      },
      error => {
        this.alertService.showAlertDanger('Erro ao remover curso. Tente novamente mais tarde')
        this.deleteModalRef.hide()
      }
    )
  }

  onDeclineDelete() {
    this.deleteModalRef.hide()
  }

}
