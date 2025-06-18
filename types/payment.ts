export interface Payment {
  package_id: string;
  payment_transaction_id: string;
  user_id: string;
  started_at: Date;
  ended_at: Date;
  status: PaymentStatus;
}

export enum PaymentStatus {
  Pending = "Pending",
  Completed = "Completed",
  Failed = "Failed",
}
