import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

type RoleName = "admin" | "employer" | "consumer";

@Entity()
export class Role {
  constructor(roleName: RoleName) {
    this.roleName = roleName;
  }
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: ["admin", "employer", "consumer"],
    default: "admin",
  })
  roleName: RoleName;

  @OneToMany(() => User, (user) => user.role, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user: User[];
}
