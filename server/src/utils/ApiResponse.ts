class ApiResponse{
    statusCode: number;
    data: any;
    success: boolean;
    constructor(statusCode:number,data:any){
        this.statusCode = statusCode,
        this.data = data
        this.success = statusCode<400
    }
}

export {ApiResponse}