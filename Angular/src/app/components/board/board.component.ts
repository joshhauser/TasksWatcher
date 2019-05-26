import { Component, OnInit, Inject, IterableDiffers, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

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


  /**
   * Get tasks from DB and push them in the list that corresponds to their status.
   * 0. To do
   * 1. In progress
   * 2. Done
   * 3. In review
   */
  getTasks(){
    this.tasksService.getTasks().subscribe(tasks => {
      tasks.forEach(_task => {
        const id = _task[0];
        const designation = _task[1];
        const deadline = _task[2];
        const status = Number(_task[3]);
        let task = new Task(designation, id, deadline, status);
        task.deadlineColor = this.getColorForDeadline(task.deadline);

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

  findInlist(list: any[], element: any){
    let isInList: boolean;
    list.forEach(e => e === element ? isInList = true : isInList = false);

    return isInList;
  }

  deleteTask(listIndex: number, task: Task){
    this.tasksService.deleteTask(task);
    let array = this.getArrayByIndex(listIndex, 'original');
    let copyOfArray = this.getArrayByIndex(listIndex, 'copy');

    let taskIndex = array.indexOf(task);
    array.splice(taskIndex, 1);
    taskIndex = copyOfArray.indexOf(task);
    copyOfArray.splice(taskIndex, 1);
  }

  /**
   * Called at each drag&drop
   * @param event : the event that correspond to the drag&drop
   */
  drop(event: CdkDragDrop<Task[]>) {
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else{
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      //get indexes of previous list and current list
      let previousIndex = Number(event.previousContainer._dropListRef.id.charAt(event.previousContainer._dropListRef.id.length -1));
      let currentIndex = Number(event.container._dropListRef.id.charAt(event.container._dropListRef.id.length -1));

      //Get arrays witch correspond to indexes
      let previousArray = this.getArrayByIndex(previousIndex, 'original');
      let previousCopy = this.getArrayByIndex(previousIndex, 'copy');
      let currentArray = this.getArrayByIndex(currentIndex, 'original');
      let currentCopy = this.getArrayByIndex(currentIndex, 'copy');

      //Get the task to update
      let taskToUpdate = this.compare(currentArray, currentCopy);

      //Update lists
      this.updateArrays(previousArray, previousCopy);
      this.updateArrays(currentArray, currentCopy);

      //Update task's status
      this.updateStatus(taskToUpdate, currentIndex);
    }
  }

  /**
   * Return an array which corresponds to index and mode
   * @param index : index of the list
   * @param mode  : original or copy
   */
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
  
  /**
   * Update datas in arrays
   * @param array : the array to update
   * @param copy : the copy of the array
   */
  updateArrays(array: Task[], copy: Task[]){
      copy = [];
      if(array.length > 0)
        array.forEach(val => copy.push(val));
  }


  /**
   * Compare two array to determine which is the moved task
   * @param array
   * @param copyOfArray 
   */
  compare(array: Task[], copyOfArray: Task[]){
    for(let i = 0; i < array.length; i++){
      if(copyOfArray.indexOf(array[i]) == -1){
        return array[i];
      }
    }
  }


  /**
   * Update task's status
   * @param t : task
   * @param status : status (index of the list in which the task has been dropped)
   */
  updateStatus(t: Task, status: number){
    let task = new Task(t.designation, t.id, t.deadline, status);
    this.tasksService.updateTask(task);
  }


  /**
   * Open dialog for task creation
   * @param listIndex : index
   */
  createTask(listIndex: number): void {
    const dialogRef = this.dialog.open(CreateTask, {
      width: '500px',
      height: '270px',
      data: listIndex
    });

    dialogRef.afterClosed().subscribe((res) => {
      if(res != undefined && res != ''){
        this.flushArrays();
        this.getTasks();   
      }
    });
  }

  editTask(listIndex: number, task: Task): void{
    const dialogRef = this.dialog.open(EditTask, {
      width: '500px',
      data: {
        listIndex,
        task
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if(res != undefined && res != ''){
        this.flushArrays();
        this.getTasks();   
      }
    });
  }

  flushArrays(){
    this.toDo.length = 0;
    this.copyOfToDo.length = 0;
    this.inProgress.length = 0;
    this.copyOfInProgress.length = 0;
    this.done.length = 0;
    this.copyOfDone.length = 0;
    this.inReview.length = 0;
    this.copyOfInReview.length = 0;
  }

  getColorForDeadline(deadline: any){
    const currentDate = new Date(Date.now());
    const _deadline = new Date(deadline);
    const time = (_deadline.getTime() - currentDate.getTime())/86400000;

    if(time <= 3 && time >= 0)
      return '#f55b45';
    else if(time < 0)
      return '#2d2d2d';
    else
      return '#70bb72';
  }
}


@Component({
  selector: 'create-task',
  templateUrl: '../create-task/create-task.html',
  styleUrls: ['../create-task/create-task.scss'],
})

export class CreateTask {

  @Input() newTask = new Task(null, null, null , null);
  minDate = new Date(Date.now());
  formControl = new FormControl('', [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CreateTask>,
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


@Component({
  selector: 'edit-task',
  templateUrl: '../edit-task/edit-task.html',
  styleUrls: ['../edit-task/edit-task.scss'],
})

export class EditTask {

  minDate = new Date(Date.now());
  formControl = new FormControl('', [Validators.required]);
  @Input() task = this.data.task;
  selectedStatus: string;
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditTask>,
    private tasksService: TasksService,
    private datePipe: DatePipe
  ){ }

  ngOnInit(){
    this.selectedStatus = Task.getStatusLabel(this.task.status);
  }

  /**
   * Update a task
   */
  updateTask(){
    const deadline = new Date(this.task.deadline);
    deadline.setDate(deadline.getDate() + 1);
    console.log(new Date(deadline.getFullYear().toString() + '-'  + deadline.getMonth().toString() + '-' + deadline.getDate().toString()))
    let task = new Task(this.task.designation, this.task.id, deadline, Task.getStatusInt(this.selectedStatus));
    console.log(task);
    this.tasksService.updateTask(task); 
  }

  deleteTask(task: Task){
    this.tasksService.deleteTask(task);
  }
}