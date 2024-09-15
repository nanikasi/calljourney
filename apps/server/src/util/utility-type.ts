export interface Entity<Identity> {
  identity(): Identity;
  equal(other: Entity<Identity>): boolean;
}
