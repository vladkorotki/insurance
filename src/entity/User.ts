import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Admin } from "./Admin";
import { Consumer } from "./Consumer";
import { Employee } from "./Employee";
import { Role } from "./Role";
import { Plans } from "./Plans";

@Entity()
export class User {
  constructor(login: string, password: string, ) {
    this.login = login;
    this.password = password;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @ManyToOne(() => Role, (role) => role.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  role: Role;

  @ManyToMany(() => Plans, (plans) => plans.user, {
    eager: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinTable()
  plans: Plans[];

  @OneToOne(() => Admin, (admin) => admin.user, {
    eager: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  admin: Admin | null;

  @OneToOne(() => Employee, (employee) => employee.user, {
    eager: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  employee: Employee | null;

  @OneToOne(() => Consumer, (consumer) => consumer.user, {
    eager: true,
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  @JoinColumn()
  consumer: Consumer | null;

  hashPassword() {
    this.password = bcrypt.hashSync(
      this.password,
      Number(process.env.HASH_PASSWORD_VALUE)
    );
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
