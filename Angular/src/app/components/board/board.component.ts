import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/model';
import { MatDialog } from '@angular/material';
import { CreateTaskDialog } from '../dialogs/create-task-dialog/create-task-dialog';
import { EditTaskDialog } from '../dialogs/edit-task-dialog/edit-task-dialog';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent implements OnInit {

  public toDo: Task[] = [];
  public inProgress: Task[] = [];
  public done: Task[] = [];
  public inReview: Task[] = [];

  public copyOfToDo: Task[] = [];
  public copyOfInProgress: Task[] = [];
  public copyOfDone: Task[] = [];
  public copyOfInReview: Task[] = [];

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

  /**
   * Find an element in the given list
   * @param list : the list in which an element will be searched
   * @param element : the searched element
   */
  findInlist(list: any[], element: any){
    let isInList: boolean;
    list.forEach(e => e === element ? isInList = true : isInList = false);

    return isInList;
  }

  /**
   * Delete a task from a list
   * @param listIndex : The index which links a list and a status (0 to 3)
   * @param task : the task to delete
   */
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
    // Drag & drop in the same list
    if(event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else{
      // Drag & drop from a list to another
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      // Get indexes of previous list and current list
      let previousIndex = Number(event.previousContainer._dropListRef.id.charAt(event.previousContainer._dropListRef.id.length -1));
      let currentIndex = Number(event.container._dropListRef.id.charAt(event.container._dropListRef.id.length -1));

      // Get arrays witch correspond to indexes
      let previousArray = this.getArrayByIndex(previousIndex, 'original');
      let previousCopy = this.getArrayByIndex(previousIndex, 'copy');
      let currentArray = this.getArrayByIndex(currentIndex, 'original');
      let currentCopy = this.getArrayByIndex(currentIndex, 'copy');

      // Get the task to update
      let taskToUpdate = this.compare(currentArray, currentCopy);

      // Update lists
      this.updateArrays(previousArray, previousCopy);
      this.updateArrays(currentArray, currentCopy);

      // Update task's status
      this.updateStatus(taskToUpdate, currentIndex);
    }
  }

  /**
   * Return an array which corresponds to an index and a mode
   * @param index : index of the list
   * @param mode  : 'original' or 'copy'
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
   * Compare two arrays
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
   * @param listIndex : number which links a list and a status
   */
  createTask(listIndex: number): void {
    const dialogRef = this.dialog.open(CreateTaskDialog, {
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

  /**
   * Open a dialog for task edition
   * @param listIndex : number which links a list and a status
   * @param task : the task to edit
   */
  editTask(listIndex: number, task: Task): void{
    const dialogRef = this.dialog.open(EditTaskDialog, {
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

  // Remove all elements from arrays
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

  /**
   * Get a color that corresponds to the gap between the current day and the deadline of a task
   * Green: more than 3 days left
   * Red: 3 days left or less
   * Black: Deadline has gone
   * @param deadline : deadline of a task
   */
  getColorForDeadline(deadline: Date){
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