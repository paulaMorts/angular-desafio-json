import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ContatosService } from './contatos/contatos.service';
import { ContatosComponent } from './contatos/contatos.component';
import { FilterPipe } from './contatos/filter.pipe';
import { ModalRemocaoComponent } from './modal-remocao/modal-remocao.component';
import { ModalMenorIdadeComponent } from './modal-menor-idade/modal-menor-idade.component';

@NgModule({
  declarations: [
    AppComponent,
    ContatosComponent,
    FilterPipe,
    ModalRemocaoComponent,
    ModalMenorIdadeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  exports: [],
  providers: [ContatosService, HttpClient],
  entryComponents: [ModalRemocaoComponent, ModalMenorIdadeComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
