import { Component, Input, Inject } from '@angular/core';
import { Task } from 'src/app/model';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'create-task',
  templateUrl: 'create-task-dialog.html',
  styleUrls: ['create-task-dialog.scss'],
})

export class CreateTaskDialog {

  @Input() newTask = new Task(null, null, null , null);
  minDate = new Date(Date.now());
  formControl = new FormControl('', [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateTaskDialog>,
    private tasksService: TasksService,
    ) {}

    /**
     * Add a new task
     */
    addTask(){
      this.newTask.status = this.data;
      this.newTask.deadline.setDate(this.newTask.deadline.getDate() +1);
      this.tasksService.addNewTask(this.newTask);
    }
}