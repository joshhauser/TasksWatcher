import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  tab = ['tab','test','lolllll','okokok','tzaeraab','terrest','lolllrearll','okokerazeraezrok', 'tzaeraab','terrest','lolllrearll','okokerazeraezrok'];
  tab2 = [1,2,3,4,5,6,7,8,9,87,87,5];

  tasks = [];

  constructor(private tasksService: TasksService) { }

  ngOnInit(){
    this.getTasks();
  }

  getTasks(){
    this.tasksService.getTasks().subscribe(res => this.tasks = res);
    this.tasks.sort();
  }

  
  addNewTask(t: any){
    if(t != ""){
      this.tasksService.addNewTask(t);
      this.tasks.push(t);
      this.tasks.sort();
    }
  }

  deleteTask(t: any){
    if(t != ""){
      this.tasksService.deleteTask(t);
      let index = this.tasks.indexOf(t);
      this.tasks.splice(index, 1);
    }
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
