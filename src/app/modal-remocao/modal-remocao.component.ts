import { Component, OnInit, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-remocao',
  templateUrl: './modal-remocao.component.html',
  styleUrls: ['./modal-remocao.component.css']
})
export class ModalRemocaoComponent implements OnInit {
  @Input() contato;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}
}
