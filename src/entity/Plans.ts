import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { IPlans } from "../shared/types/types";
import { User } from "./User";

@Entity()
export class Plans {
  constructor({ ...data }: IPlans) {
    this.name = data.name;
    this.type = data.type;
    this.contributions = data.contributions;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.friquence = data.friquence;
    this.initialized = false;
   
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  contributions: number;

  @Column({ type: "date", nullable: true })
  startDate: Date;

  @Column({ type: "date",nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  friquence: number;

  @Column({ nullable: true })
  initialized: boolean;

  @Column({nullable:true})
  userType:string

  @ManyToMany(() => User, (user) => user.plans, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user: User[];
}
