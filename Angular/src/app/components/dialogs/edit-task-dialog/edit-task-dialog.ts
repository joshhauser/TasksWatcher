import { Component, Inject, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/model';

@Component({
  selector: 'edit-task',
  templateUrl: 'edit-task-dialog.html',
  styleUrls: ['edit-task-dialog.scss'],
})

export class EditTaskDialog {

  // Max length for task's title
  private maxTitleLength = 300;

  // Number of remaining characters
  public charsLeft: number;
  // Form control for task edition form
  public form = new FormGroup({
    title: new FormControl('', Validators.required),
    deadline: new FormControl(),
    status: new FormControl()
  });

  // Min date for Mat Date Picker
  public currentDate = new Date(Date.now());
  // The task to edit
  @Input() task = this.data.task;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditTaskDialog>,
    private tasksService: TasksService
  ){ }

  ngOnInit(){
    if(this.task.deadline == '0000-00-00'){
      this.task.deadline = null;
    }

    const formValues = {
      title: this.task.designation,
      deadline: this.task.deadline,
      status: Task.getStatusLabel(this.task.status)
    };
    
    this.form.setValue(formValues);
    this.charsLeft = this.maxTitleLength - this.form.value.title.length;
  }

  // Update a task
  updateTask(){
    const designation = this.form.value.title;
    const deadline = this.form.value.deadline;
    const status = this.form.value.status;
    let oldDeadlineDay : Date;

    if(this.task.deadline != null)
      oldDeadlineDay = this.task.deadline.split('-')[2];

    if(deadline != null && deadline.getDate() != oldDeadlineDay)
      deadline.setDate(deadline.getDate() + 1);

    let task = new Task(designation, this.task.id, deadline, Task.getStatusInt(status));
    this.tasksService.updateTask(task); 
  }

  /**
   * Delete the current task
   * @param task : the task to delete
   */
  deleteTask(task: Task){
    this.tasksService.deleteTask(task);
  }

  /**
   * Called for each typed key when task's title edition
   * Determines the number of remaining characters
   * @param event 
   */
  onKey(event: any){
    this.charsLeft = this.maxTitleLength - this.form.value.title.length;
  }
}