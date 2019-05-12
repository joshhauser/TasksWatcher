import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  Tasks = new BehaviorSubject<any>(null);

  baseUrl = 'http://localhost/kanban/';
  private tasks = [];

  constructor(private http: HttpClient) { }

  
  addNewTask(t: string){
    let task = {
      task: t
    }
    return this.http.post(this.baseUrl + 'INSERT_TASK.php', { data : task}).toPromise();

  }
/*
  getTasks(): Observable<any[]>{
    return this.http.get(this.baseUrl + 'SELECT_TASKS.php').pipe(
      map((res) => {
        this.tasks = res['data'];
        console.log("tasks: " + this.tasks);
        console.log("res: "  + res);
        return this.tasks;
      })
    );
    
  }*/

  getTasks(){
    return this.http.get(this.baseUrl + 'SELECT_TASKS.php').toPromise().then(
      (res) => this.Tasks.next(res)
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
