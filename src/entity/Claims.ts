import {
  Column,
  Entity,
  Generated,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IClaims, IPlans } from "../shared/types/types";
import { Consumer } from "./Consumer";
import { Employee } from "./Employee";
import { User } from "./User";

@Entity()
export class Claims {
  constructor({ ...data }: IClaims) {
    this.consumerId = data.consumerId;
    // this.employer = data.employer;
    // this.employer = this.consumer?.employee.name;
    this.phone = data.phone;
    this.date = data.date;
    this.plan = data.plan;
    this.amount = data.amount;
    this.status = data.status;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @PrimaryGeneratedColumn()
  claimNumber: number;

  @Column({ nullable: true })
  consumerId: string;

  @Column({ nullable: true })
  employer: string;

  @Column({ type: "date", nullable: true })
  date: Date;

  @Column({ nullable: true })
  plan: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  amount: string;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => Consumer, (consumer) => consumer.claims, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  consumer: Consumer;
}
