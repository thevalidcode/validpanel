export interface UserType{
  "success": string,
  "plan": string,
  "user": {
    "id": number,
    "email": string,
    "fullName": string
  }
}

export interface LoginErrorType{
  status: number,
  message: string,
  "response": {
    "data": {
      "error": string
    }
  }
}