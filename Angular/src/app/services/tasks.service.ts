import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Task } from '../model';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  // URL for API calls
  private baseUrl = 'http://localhost/kanban/';
  // Tasks
  private tasks: Task[] = [];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar) { }

  /**
   * Create a task in DB
   * @param task : the new task
   */
  addNewTask(task: Task){
    return this.http.post(this.baseUrl + 'INSERT_TASK.php', { data : task}).toPromise().then(() => this.tasks.push(task));
  }

  // Get all tasks
  getTasks(): Observable<Task[]>{
    return this.http.get<Task>(this.baseUrl + 'SELECT_TASKS.php').pipe(
      map((res) => {
        this.tasks = res['data'];
        return this.tasks;
      })
    );
  }

  /**
   * Update a task
   * @param task : the task to update
   */
  updateTask(task: Task){
    return this.http.put(this.baseUrl + 'UPDATE_TASK.php', { data: task}).toPromise();
  }

  /**
   * Delete a task
   * @param task : the task to delete
   */
  deleteTask(task: Task){
    this.http.delete(this.baseUrl + 'DELETE_TASK.php?taskID=' + task.id).toPromise()
    .then((success) => this.openSnackBar('The task ' + task.designation + ' has been deleted successfully !'),
          (error) => console.log(error));
  }

  /**
   * Open a snackbar to display a message
   * @param message : the message to display
   */
  openSnackBar(message: string){
    let snackbar = this.snackBar.open(message, 'Cancel');

    snackbar.onAction().subscribe(() => this.snackBar.dismiss());
  }
  
}