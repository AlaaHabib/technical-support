export class CustomException extends Error {
  friendlyMsg: string;
  error: Error;
  status: string;
  typeError: string;
  constructor(error: Error, friendlyMsg: string) {
    super(error.message);
    this.error = error;
    this.friendlyMsg = friendlyMsg ;
    this.status = error['status'] ;
    this.typeError = error['type'] ;
  }
}
