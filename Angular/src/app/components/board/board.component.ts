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

  tasks: Task[] = [];

  constructor(
    private tasksService: TasksService,
    private dialog: MatDialog
    ) { }

  ngOnInit(){
    this.getTasks();
  }

  getTasks(){
    this.tasksService.getTasks().subscribe(res => {
      res.forEach(col => {
        const id = col[0];
        const designation = col[1];
        const deadline = col[2];
        const status = col[3];
        const task = new Task(designation, id, deadline, status);

        this.tasks.push(task);
      })
    });
    //this.tasks.sort();
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