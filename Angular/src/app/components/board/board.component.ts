import { Component, OnInit, Inject, IterableDiffers, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

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

  color: 'red';

  copyOfToDo: Task[] = [];
  copyOfInProgress: Task[] = [];
  copyOfDone: Task[] = [];
  copyOfInReview: Task[] = [];

  wrongDate = new Date('0000-00-00');
  constructor(
    private tasksService: TasksService,
    private dialog: MatDialog
    ) { }

  ngOnInit(){
    this.tasksService.getTasks().toPromise().then(() => this.getTasks());
  }


  /**
   * Get tasks from DB and push them in the list that corresponds to their status.
   * 0 : To do
   * 1: In progress
   * 2: Done
   * 3: In review
   */
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

  findInlist(list: any[], element: any){
    let isInList: boolean;
    list.forEach(e => e === element ? isInList = true : isInList = false);

    return isInList;
  }
  
  /**
   * Delete a task
   * @param t : the task do delete
   */
  /*deleteTask(task: Task){
    if(task != null){
      this.tasksService.deleteTask(task);
      let index = this.toDo.indexOf(task);
      this.toDo.splice(index, 1);
    }
  }*/

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
        this.tasksService.getTasks();
        let array = this.getArrayByIndex(listIndex, "original");
        let copyOfArray = this.getArrayByIndex(listIndex, "copy");
        array.push(this.tasksService.tasks[this.tasksService.tasks.length -1]);
        copyOfArray.push(this.tasksService.tasks[this.tasksService.tasks.length -1]);
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditTask>,
    private tasksService: TasksService
  ){}

  /**
   * Update a task
   */
  updateTask(){
    this.tasksService.updateTask(this.task);
  }

  deleteTask(){

  }
}