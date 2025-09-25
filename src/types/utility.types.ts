export interface Err{
  status: number,
  message: string,
  "response": {
    "data": {
      "error": {
        fieldErrors: {
          fullName: string
        }
      }
    }
  }
}