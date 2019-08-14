import { Component, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TasksService } from 'src/app/services/tasks.service';
import { DatePipe } from '@angular/common';
import { Task } from 'src/app/model';

@Component({
  selector: 'edit-task',
  templateUrl: 'edit-task-dialog.html',
  styleUrls: ['edit-task-dialog.scss'],
})

export class EditTaskDialog {

  maxTitleLength = 300;

  charsLeft: number;

  form = new FormGroup({
    title: new FormControl('', Validators.required),
    deadline: new FormControl(),
    status: new FormControl()
  });

  minDate = new Date(Date.now());
  @Input() task = this.data.task;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditTaskDialog>,
    private tasksService: TasksService,
    private datePipe: DatePipe
  ){ }

  ngOnInit(){
    const formValues = {
      title: this.task.designation,
      deadline: this.task.deadline,
      status: Task.getStatusLabel(this.task.status)
    };
    this.form.setValue(formValues);
    this.charsLeft = this.maxTitleLength - this.form.value.title.length;
  }

  /**
   * Update a task
   */
  updateTask(){
    const designation = this.form.value.title;
    const deadline = new Date(this.form.value.deadline);
    const status = this.form.value.status;
    const oldDeadlineDay = this.task.deadline.split('-')[2];

    if(deadline.getDate() != oldDeadlineDay)
      deadline.setDate(deadline.getDate() + 1);

    let task = new Task(designation, this.task.id, deadline, Task.getStatusInt(status));
    this.tasksService.updateTask(task); 
  }

  deleteTask(task: Task){
    this.tasksService.deleteTask(task);
  }

  onKey(event: any){
    this.charsLeft = this.maxTitleLength - this.form.value.title.length;
  }
}