/**
 * Interface for all database seeders
 */
export interface ISeeder {
  /**
   * Order of execution (lower = first)
   */
  readonly order: number;

  /**
   * Seeder name for logging
   */
  readonly name: string;

  /**
   * Run the seeder - insert data if not exists
   */
  run(): Promise<void>;

  /**
   * Reset/delete seeded data
   */
  reset(): Promise<void>;
}
