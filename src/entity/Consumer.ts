import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Claims } from "./Claims";
import { Employee } from "./Employee";
import { User } from "./User";

@Entity()
export class Consumer {
  constructor({ ...data }) {
    this.name = data.name;
    this.countryCode = data.countryCode;
    this.lastName = data.lastName;
    this.email = data.email;
    this.admin = data.admin;
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  
  @Column({ nullable: true })
  countryCode: string;

  @Column({ nullable: true})
  name: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  admin: boolean;

  @OneToOne(() => User, (user: User) => user.consumer, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => Employee, (employee) => employee.consumer, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  employee: Employee;

  @OneToMany(() => Claims, (claims) => claims.consumer, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  claims: Claims[];
}
