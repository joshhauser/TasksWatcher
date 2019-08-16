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

  // New task
  @Input() newTask = new Task(null, null, null , null);
  // Min date for Mat Date Picker
  public minDate = new Date(Date.now());
  // Form control for task title
  public formControl = new FormControl('', [Validators.required]);
  // Number of remaining characters
  public charsLeft: number;

  // Max length for task's title
  private maxTitleLength = 300;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateTaskDialog>,
    private tasksService: TasksService,
    ) {}

  // Create a new task
  addTask(){
    this.newTask.status = this.data;
    this.newTask.deadline.setDate(this.newTask.deadline.getDate() +1);
    this.tasksService.addNewTask(this.newTask);
  }

  /**
   * Called for each typed key when task's title edition
   * Determines the number of remaining characters
   * @param event 
   */
  onKey(event: any){
    this.charsLeft = this.maxTitleLength - this.formControl.value.length;
  }
}