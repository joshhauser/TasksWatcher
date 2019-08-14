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

  Tasks = new BehaviorSubject<Task[]>(null);

  baseUrl = 'http://localhost/kanban/';
  tasks: Task[] = [];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar) { }

  
  addNewTask(task: Task){
    return this.http.post(this.baseUrl + 'INSERT_TASK.php', { data : task}).toPromise().then(() => this.tasks.push(task));
  }


  getTasks(): Observable<Task[]>{
    return this.http.get<Task>(this.baseUrl + 'SELECT_TASKS.php').pipe(
      map((res) => {
        this.tasks = res['data'];
        return this.tasks;
      })
    );
  }

  updateTask(task: Task){
    return this.http.put(this.baseUrl + 'UPDATE_TASK.php', { data: task}).toPromise();
  }

  deleteTask(task: Task){
    this.http.delete(this.baseUrl + 'DELETE_TASK.php?taskID=' + task.id).toPromise()
    .then((success) => this.openSnackBar('The task ' + task.designation + ' has been deleted successfully !'),
          (error) => console.log(error));

          //this.openSnackBar('Ooops something went wrong: ' + error)
  }

  /* deleteTask(t: any){
    this.http.delete(this.baseUrl + 'DELETE_TASK.php?task=' + t).toPromise()
  } */

  openSnackBar(message: string){
    let snackbar = this.snackBar.open(message, 'Cancel');

    snackbar.onAction().subscribe(() => this.snackBar.dismiss());
  }
  
}