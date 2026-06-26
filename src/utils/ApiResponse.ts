class ApiResponse {
    status: number;
    message: string;
    data: any;
    sucess: boolean;

    constructor(status: number, message = "Success", data?: any) {
        this.status = status;
        this.message = message;
        this.data = data;
        this.sucess = status < 400;
    }   
}

export { ApiResponse };