import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Admin {
  constructor({ ...data }: any) {
    this.name = data.name;
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToOne(() => User, (user: User) => user.admin)
  user: User;
}
