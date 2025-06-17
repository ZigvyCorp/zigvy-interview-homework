export class ResponseDto<T> {
  data: T;
  statusCode: number;
  message: string;

  constructor(data: T, statusCode: number, message: string) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }

  toJSON() {
    return {
      data: this.data,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
