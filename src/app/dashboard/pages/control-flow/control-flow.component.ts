import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Grade = 'A' | 'B' | 'F';

@Component({
  selector: 'app-control-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-flow.component.html',
  styleUrl: './control-flow.component.css'
})
export default class ControlFlowComponent {

  public showContent = signal(false);
  public grade = signal<Grade>('A');
  public frameworks = signal(['Angular', 'React', 'Vue']);
  public frameworks2 = signal([]);

  public toggleContent() {
    this.showContent.update( value => !value );
  }



}
