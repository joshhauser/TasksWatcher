import { Component, OnInit, Inject, IterableDiffers } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { CompileMetadataResolver } from '@angular/compiler';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {

  toDo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  inReview: Task[] = [];

  copyOfToDo: Task[] = [];
  copyOfInProgress: Task[] = [];
  copyOfDone: Task[] = [];
  copyOfInReview: Task[] = [];

  constructor(
    private tasksService: TasksService,
    private dialog: MatDialog
    ) { }

  ngOnInit(){
    this.getTasks();
  }


  getTasks(){
    this.tasksService.getTasks().subscribe(tasks => {
      tasks.forEach(_task => {
        const id = _task[0];
        const designation = _task[1];
        const deadline = _task[2];
        const status = Number(_task[3]);
        const task = new Task(designation, id, deadline, status);

        switch(task.status){
          case 0:
            this.toDo.push(task);
            this.copyOfToDo.push(task);
            break;

          case 1:
            this.inProgress.push(task);
            this.copyOfInProgress.push(task);
            break;

          case 2:
            this.done.push(task);
            this.copyOfDone.push(task);
            break;

          case 3:
            this.inReview.push(task);
            this.copyOfInReview.push(task);
            break;
        }
      })
    });
  }

  
  

  deleteTask(t: any){
    if(t != ""){
      this.tasksService.deleteTask(t);
      let index = this.toDo.indexOf(t);
      this.toDo.splice(index, 1);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      
      let previousIndex = Number(event.previousContainer._dropListRef.id.charAt(event.previousContainer._dropListRef.id.length -1));
      let currentIndex = Number(event.container._dropListRef.id.charAt(event.container._dropListRef.id.length -1));

      let previousArray = this.getArrayByIndex(previousIndex, 'original');
      let previousCopy = this.getArrayByIndex(previousIndex, 'copy');
      let currentArray = this.getArrayByIndex(currentIndex, 'original');
      let currentCopy = this.getArrayByIndex(currentIndex, 'copy');

      this.compare(currentArray, currentCopy);
      this.updateArrays(previousArray, previousCopy);
      this.updateArrays(currentArray, currentCopy);
    }
  }

  getArrayByIndex(index, mode){
    if(mode == 'original'){
      switch(index){
        case 0: return this.toDo;
        case 1: return this.inProgress;
        case 2: return this.done;
        case 3: return this.inReview;
      }
    }
    else if(mode == 'copy'){
      switch(index){
        case 0: return this.copyOfToDo;
        case 1: return this.copyOfInProgress;
        case 2: return this.copyOfDone;
        case 3: return this.copyOfInReview;
      }
    }
  }
  
  updateArrays(array: Task[], copy: Task[]){
      copy = [];
      if(array.length > 0)
        array.forEach(val => copy.push(val));
  }

  compare(array: Task[], copyOfArray: Task[]){
    for(let i = 0; i < array.length; i++){
      if(copyOfArray.indexOf(array[i]) == -1){
        this.updateStatus(array[i]);
      }
    }
  }

  updateStatus(task: Task){
    console.log(task);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateTask, {
      width: '250px',
      height: '300px',
      data: "ouais"
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}


@Component({
  selector: 'create-task',
  templateUrl: '../create-task/create-task.html',
  styleUrls: ['../create-task/create-task.scss'],
})


export class CreateTask {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateTask>,
    ) {}
    
}