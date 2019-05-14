import { Component, OnInit, Inject } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {

  tab = ['tab','test','lolllll','okokok','tzaeraab','terrest'];
  tab2 = [1,2,3,4,5,6,7,8,9,87,87,5];

  toDo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  inReview: Task[] = [];


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
        const status = _task[3];
        const task = new Task(designation, id, deadline, status);

        switch(task.status){
          case 0:
            this.toDo.push(task);
            break;

          case 1:
            this.inProgress.push(task);
            break;

          case 2:
            this.done.push(task);
            break;

          case 3:
            this.inReview.push(task);
            break;
        }
      })
    });
    //this.tasks.sort();
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
      console.log(event.container.data);
      console.log(event.previousContainer.data);

    }
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