import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { Task } from '../model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  Tasks = new BehaviorSubject<Task[]>(null);

  baseUrl = 'http://localhost/kanban/';
  private tasks: Task[] = [];

  constructor(private http: HttpClient) { }

  
  addNewTask(t: string){
    let task = {
      task: t
    }
    return this.http.post(this.baseUrl + 'INSERT_TASK.php', { data : task}).toPromise();

  }

  getTasks(): Observable<any[]>{
    return this.http.get<Task>(this.baseUrl + 'SELECT_TASKS.php').pipe(
      map((res) => {
        this.tasks = res['data'];
        return this.tasks;
      })
    );
    
  }


  deleteTask(t: any){
    this.http.delete(this.baseUrl + 'DELETE_TASK.php?task=' + t).toPromise();
  }

  /*openSnackBar(message: string){
    let snackbar = this.snackBar.open(message, 'Cancel');

    snackbar.onAction().subscribe(() => this.snackBar.dismiss());
  }*/
  
}