import { Expose, Transform } from 'class-transformer';

export class OrderResponseDto {
  @Expose()
  id_order: number;

  @Expose()
  state_name: string;

  @Expose()
  customer_name: string;

  @Expose()
  @Transform(({ value }) => value ? new Date(value).toISOString().split('T')[0] : null)
  entry_date: string;

  @Expose()
  @Transform(({ value }) => value ? new Date(value).toISOString().split('T')[0] : null)
  estimated_delivery_date?: string;
}
