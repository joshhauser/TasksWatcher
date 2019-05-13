import { VirtualTimeScheduler } from 'rxjs';

export class Task{
    id: number;
    designation: string;
    deadline: Date;
    status: number;

    constructor(designation: string, id?: number, deadline?: Date, status?: number){
        this.id = id;
        this.designation = designation;
        this.deadline = deadline;
        this.status = status;
    }
}