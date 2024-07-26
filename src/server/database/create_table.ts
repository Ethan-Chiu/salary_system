import { container } from "tsyringe";
import { Database } from "./client";
import { LevelRange, initLevelRange} from "./entity/SALARY/level_range";
import { Level, initLevel} from "./entity/SALARY/level";

const sequelize = container.resolve(Database).connection;

initLevelRange(sequelize);
initLevel(sequelize);

Level.hasMany(LevelRange, {
  sourceKey: 'id',
  foreignKey: 'level_end_id',
  as: 'level_ranges' // this determines the name in `associations`!
});

LevelRange.hasOne(Level, {
  foreignKey: 'id',
  as: 'level_end' // this determines the name in `associations`!
});
