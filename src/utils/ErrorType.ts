export default interface ErrorType {
  status: number;
  success: boolean;
  message: string;
  datail?: object;
}
