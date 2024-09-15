import type { User } from "../model/user";
import type { ID } from "../value-object/id";

export interface UserRepository {
  findBy(id: ID): Promise<User | null>;

  save(user: User): Promise<void>;
  delete(user: User): Promise<void>;
}
