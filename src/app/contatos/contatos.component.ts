import { ModalMenorIdadeComponent } from './../modal-menor-idade/modal-menor-idade.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Contato } from './contato.interface';
import { ContatosService } from './contatos.service';
import { Subscription } from 'rxjs';
import { ModalRemocaoComponent } from './../modal-remocao/modal-remocao.component';

import * as moment from 'moment';

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})
export class ContatosComponent implements OnInit, OnDestroy {
  public formularioContato: FormGroup;
  public contatos: Contato[] = [];
  public contatosFiltrados: Contato[] = [];
  public contatoSelecionado: Contato;
  public contatoFoiSelecionado: boolean;
  public adicionarFoiClicado: boolean;
  public pesquisaDoUsuario: string;

  private inscricaoDoObservable: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private contatosService: ContatosService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.criarFormularioContato();
    this.obterContatos();
  }

  /* compara o array de contatos através da função ordernador de acordo com o parâmetro passado (nome ou data de nascimento)
     contatos filtrados ou contatos (array) */
  public ordernar(parametroDeOrdenacao: string): Contato[] {
    if (this.contatosFiltrados.length > 0) {
      return this.ordernador(this.contatosFiltrados, parametroDeOrdenacao);
    } else {
      return this.ordernador(this.contatos, parametroDeOrdenacao);
    }
  }

  // ordena o array através da função sort
  public ordernador(
    listaDeContatos: Contato[],
    parametroDeOrdenacao: string
  ): Contato[] {
    return listaDeContatos.sort((a: Contato, b: Contato) => {
      return a[parametroDeOrdenacao].localeCompare(b[parametroDeOrdenacao]);
    });
  }

  // cria um novo array de contatos filtrados, de acordo com o sexo clicado
  public filtrarPorGenero(genero: string): Contato[] {
    return (this.contatosFiltrados = this.contatos.filter(
      contatos => contatos.sexo === genero
    ));
  }

  // função responsável por mostrar formulário
  public adicionarContato(): boolean {
    return (this.adicionarFoiClicado = true);
  }

  // fecha o formulário e reseta os campos digitados (limpa o formulário)
  public cancelarEdicao() {
    this.adicionarFoiClicado = false;
    this.contatoFoiSelecionado = false;
    this.formularioContato.reset();
  }

  /* salva o contato se o formulário for válido e se contato for maior de idade
     caso contato seja menor de idade, é exibida uma modal informando o erro */

  public salvarContato(contato: Contato) {
    if (this.formularioContato.valid) {
      if (this.verificarSeMaiorIdade(contato.data_nascimento)) {
        return this.contatosService
          .salvarContato(contato)
          .subscribe(contatoSalvo => {
            this.obterContatos();
            this.formularioContato.reset();
            this.adicionarFoiClicado = false;
            return contatoSalvo;
          });
      }
      const modal = this.modalService.open(ModalMenorIdadeComponent, {
        centered: true
      });
      modal.componentInstance.contato = contato;
    }
  }

  // funcao que verifica se é maior de idade utilizando biblioteca do moment
  verificarSeMaiorIdade(idade: string): boolean {
    const idadeDoContato = moment().diff(idade, 'years');
    if (idadeDoContato >= 18) {
      return true;
    }
    return false;
  }

  public selecionarContato(contato: Contato) {
    this.contatoFoiSelecionado = true;
    // contato Obtido é o retorno do serviço do contato que o usuário clicou   
    this.contatosService.obterUmContato(contato.id).subscribe(contatoObtido => {
      this.contatoSelecionado = contatoObtido;
      this.atualizaDadosDoFormulario();
    });
  }

  // atualização do formulário com os dados do contato selecionado
  public atualizaDadosDoFormulario() {
    this.formularioContato.get('nome').setValue(this.contatoSelecionado.nome);
    this.formularioContato
      .get('data_nascimento')
      .setValue(this.contatoSelecionado.data_nascimento);
    this.formularioContato.get('sexo').setValue(this.contatoSelecionado.sexo);
  }

  // atualiza o contato selecionado com os novos valores do formulário 
  public atualizarContato(contato: Contato) {
    this.contatosService
      .atualizarContato(contato, this.formularioContato.value)
      .subscribe(contatoAtualizado => {
        this.obterContatos();
        this.adicionarFoiClicado = false;
        this.contatoFoiSelecionado = false;
        return contatoAtualizado;
      });
  }

  // modal para remover contato
  public removerContato(contato: Contato) {
    const modal = this.modalService.open(ModalRemocaoComponent, {
      centered: true
    });

    modal.componentInstance.contato = contato;

    return modal.result.then(concordouComRemocao => {
      if (concordouComRemocao) {
        this.contatosService
          .removerContato(contato.id)
          .subscribe(contatoRemovido => {
            this.contatoFoiSelecionado = false;
            this.obterContatos();
            this.formularioContato.reset();
            return contatoRemovido;
          });
      }
    });
  }

  /* se pesquisar por usuário for pelo input, apaga o input atribuindo null
     se pesquisar for por filtro apaga o filtor retornando o array vazio */
  public limparFiltros(): void {
    this.pesquisaDoUsuario = null;
    this.contatosFiltrados = [];
  }

  // verifica o sexo do contato e adiciona uma classe css 
  public adicionaEstiloSexo(contato: Contato): string {
    if (contato.sexo === 'Feminino') {
      return 'fas fa-venus';
    } else {
      return 'fas fa-mars';
    }
  }

  // formulário reativo
  private criarFormularioContato(): FormGroup {
    return (this.formularioContato = this.formBuilder.group({
      nome: ['', Validators.required],
      data_nascimento: ['', Validators.required],
      sexo: ['', Validators.required]
    }));
  }

  // retorna a lista de contatos através do array/mock de contatos existente
  private obterContatos() {
    return this.contatosService
      .obterContatos()
      .subscribe(contatos => (this.contatos = contatos));
  }

  // boa prática ao se utilizar o subscribe é fazer um unsubscribe
  ngOnDestroy() {
    if (this.inscricaoDoObservable) {
      this.inscricaoDoObservable.unsubscribe();
    }
  }
}
