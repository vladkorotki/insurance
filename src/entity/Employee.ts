import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RoleData } from "../shared/types/types";
import { Consumer } from "./Consumer";
import { Plans } from "./Plans";
import { User } from "./User";

@Entity()
export class Employee {
  constructor({ ...data }: RoleData) {
    this.name = data.name;
    this.countryCode = data.countryCode?.toLocaleUpperCase();
    this.email = data.email;
    // this.state = data.state;
    this.file = data.file;
    this.city = data.city;
    this.street = data.street;
    this.zipCode = data.zipCode;
    this.phone = data.phone;
    this.userLogin = data.login;
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  file: string;

  @Column({ nullable: true })
  userLogin: string;

  @Column()
  countryCode: string;

  @Column()
  email: string;

  // @Column()
  // state: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  zipCode: string;

  @Column()
  phone: string;

  @Column({ default: true })
  allowToAddConsumers: boolean;

  @Column({ default: true })
  allowToFilingClaims: boolean;

  @OneToOne(() => User, (user: User) => user.employee, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user: User;

  @OneToMany(() => Consumer, (consumer) => consumer.employee, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  consumer: Consumer[];
}
