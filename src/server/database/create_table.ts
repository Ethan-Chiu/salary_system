import { container } from "tsyringe";
import { Database } from "./client";
import { LevelRange, initLevelRange} from "./entity/SALARY/level_range";
import { Level, initLevel} from "./entity/SALARY/level";
import { LevelRangeLevel, initLevelRangeLevel } from "./entity/SALARY/level_range_level";

const sequelize = container.resolve(Database).connection;

initLevelRange(sequelize);
initLevel(sequelize);
initLevelRangeLevel(sequelize);

Level.belongsToMany(LevelRange, {through: LevelRangeLevel})
LevelRange.belongsToMany(Level, {through: LevelRangeLevel})
