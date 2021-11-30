import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertModalService } from 'src/app/shared/alert-modal.service';
import { CursosService } from '../cursos.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Cursos2Service } from '../cursos2.service';

@Component({
  selector: 'app-cursos-form',
  templateUrl: './cursos-form.component.html',
  styleUrls: ['./cursos-form.component.scss'],
  preserveWhitespaces: true
})
export class CursosFormComponent implements OnInit {

  form!: FormGroup
  submitted = false

  constructor(
    private fb: FormBuilder,
    private service: Cursos2Service,
    private modal: AlertModalService,
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    // this.route.params.subscribe(
    //   (params: any) => {
    //     const id = params.id  //ou params.['id']
    //   console.log(id)
    //   const curso$ = this.service.loadByID(id)
    //   curso$.subscribe(curso => {
    //     this.updateForm(curso)
    //   })
    //   }
    // )

    // this.route.params
    // .pipe(
    //   map((params: any) => params.id),
    //   switchMap(id => this.service.loadByID(id))
    // )
    // .subscribe(curso => this.updateForm(curso))

    const curso = this.route.snapshot.data['curso']

    this.form = this.fb.group({
      id: [curso.id],
      nome: [curso.nome, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    })

  }

  // updateForm(curso: any) {
  //   this.form.patchValue({
  //     id: curso.id,
  //     nome: curso.nome
  //   })
  // }

  hasError(field: string) {
    return this.form.get(field)!.errors
  }

  onSubmit() {

    if (this.form.valid) {
      console.log('submit')

      let msgSuccess = 'Curso criado com sucesso!'
      let msgError = 'Erro ao criar o curso, tente novamente'
      if (this.form.value.id) {
        msgSuccess = 'Curso atualizado com sucesso!'
        msgError = 'Erro ao atualizar o curso, tente novamente'
      }

      this.service.save(this.form.value).subscribe(
        success => {
          this.modal.showAlertSuccess(msgSuccess)
          this.location.back()
        },
        error => this.modal.showAlertDanger(msgError)
      )
    }
  }

  onCancel() {
    this.submitted = true
    this.form.reset()
  }

}
