import { CustomLogger } from 'src/domain/helpers';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { ProductionSeeder } from './production.seed';

export class SeedRunner {
  public static async run(
    dataSource: DataSource,
    configService: ConfigService,
  ) {
    CustomLogger('start seeding');
    await dataSource.initialize();
    // Chick if Data was Seeded
    let count = 0;
    // try {
    const data = await dataSource.query('select Count(*) as count from users');
    CustomLogger({ data });
    count = data[0].count;
    CustomLogger({ count });
    // } catch (error) {}
    if (count == 0) {
      // seed data required for production via ProductionSeeder class
      const productionSeeder = new ProductionSeeder(dataSource);
      // define the root user

      CustomLogger('Production Seed');
      // seed production data, pass root user
      await productionSeeder.seed();
      // run seeder in debugging environment
      if (process.env.NEST_ENV != 'production') {
        // await runSeeders(dataSource);
        // CustomLogger('Debugging Data Seeded');
      }
      dataSource.destroy();
    }
  }
}
