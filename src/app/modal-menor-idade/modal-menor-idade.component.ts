import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-menor-idade',
  templateUrl: './modal-menor-idade.component.html',
  styleUrls: ['./modal-menor-idade.component.css']
})
export class ModalMenorIdadeComponent implements OnInit {

  @Input() contato;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
