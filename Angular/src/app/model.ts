export class Task{
    id: number;
    designation: string;
    deadline: Date;
    status: number;
    deadlineColor: string;

    constructor(designation: string, id?: number, deadline?: Date, status?: number){
        this.id = id;
        this.designation = designation;
        this.deadline = deadline;
        this.status = status;
    }

    /**
     * Get status label from index
     * @param status : the status index
     */
    static getStatusLabel(status: number): string {
        switch(status){
            case 0:
                return 'To do';
            
            case 1:
                return 'In progress';
            
            case 2:
                return 'Done';

            case 3:
                return 'In review';

            default:
                return null;            
        }
    }

    /**
     * Get status index from label
     * @param statusLabel : status label
     */
    static getStatusInt(statusLabel: string): number {
        switch(statusLabel){
            case 'To do':
                return 0;

            case 'In progress':
                return 1;

            case 'Done':
                return 2;
            
            case 'In review':
                return 3;
            
            default:
                return null;
        }
    }

}