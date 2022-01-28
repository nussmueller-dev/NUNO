import { Component, OnInit } from '@angular/core';
import { Rule } from 'src/app/shared/models/rule';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  rules: Array<Rule> = [];
  
  ngOnInit() {
    this.rules.push(new Rule('Ziehen mildern', 'Muss ein Spieler durch eine +2 oder +4 Karte, Karten ziehen, so wird er mit dieser Regel danach noch eine Karte legen dürfen. Normalerweise wäre nun der nächste Spieler am Zug.', true));
    this.rules.push(new Rule('Kumulieren', 'Kann ein Spieler, der von einer +2-Karte betroffen ist, selbst mit einer solchen Karte aufwarten, so ist dies erlaubt und der nächste Spieler nach ihm muss nun 4 Karten ziehen. Hat dieser ebenfalls eine +2-Karte, so ist auch dies zulässig. Gleiches gilt entsprechend für die +4-Karten. Die Karten dürfen allerdings nicht kombiniert werden.', true));
    this.rules.push(new Rule('Dazwischenlegen', 'Wenn ein Spieler exakt die gleiche Karte auf der Hand hat, welche soeben ausgespielt wurde (gleiche Farbe und Zahl), so kann er diese sofort ablegen – auch wenn er nicht am Zug ist. Die Runde geht jedoch bei dem Spieler weiter, welcher regulär an der Reihe gewesen wäre.', false));
    this.rules.push(new Rule('Buzzer aktivieren', 'Hiermit kann man den Buzzer in dieser Spielrunde verwenden.', false, true));
  }
}
