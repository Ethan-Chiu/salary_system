import { container } from "tsyringe";
import { Database } from "./client";
import { initLevelRange } from "./entity/SALARY/level_range";
import { initLevel } from "./entity/SALARY/level";
import { initAccessSetting } from "./entity/SALARY/access_setting";
import { initAttendanceSetting } from "./entity/SALARY/attendance_setting";
import { initBankSetting } from "./entity/SALARY/bank_setting";
import { initBasicInfo } from "./entity/SALARY/basic_info";
import { initBonusDepartment } from "./entity/SALARY/bonus_department";
import { initBonusPositionType } from "./entity/SALARY/bonus_position_type";
import { initBonusPosition } from "./entity/SALARY/bonus_position";
import { initBonusSeniority } from "./entity/SALARY/bonus_seniority";
import { initBonusSetting } from "./entity/SALARY/bonus_setting";
import { initEmployeeAccount } from "./entity/SALARY/employee_account";
import { initEmployeeData } from "./entity/SALARY/employee_data";
import { initEmployeePayment } from "./entity/SALARY/employee_payment";
import { initEmployeeTrust } from "./entity/SALARY/employee_trust";
import { initHolidaysType } from "./entity/SALARY/holidays_type";
import { initInsuranceRateSetting } from "./entity/SALARY/insurance_rate_setting";
import { initPerformanceLevel } from "./entity/SALARY/performance_level";
import { initTransaction } from "./entity/SALARY/transaction";
import { initTrustMoney } from "./entity/SALARY/trust_money";
import { initUser } from "./entity/SALARY/user";

const sequelize = container.resolve(Database).connection;

initAccessSetting(sequelize);
initAttendanceSetting(sequelize);
initBankSetting(sequelize);
initBasicInfo(sequelize);
initBonusDepartment(sequelize);
initBonusPositionType(sequelize);
initBonusPosition(sequelize);
initBonusSeniority(sequelize);
initBonusSetting(sequelize);
initEmployeeAccount(sequelize);
initEmployeeData(sequelize);
initEmployeePayment(sequelize);
initEmployeeTrust(sequelize);
initHolidaysType(sequelize);
initInsuranceRateSetting(sequelize);
initLevelRange(sequelize);
initLevel(sequelize);
initPerformanceLevel(sequelize);
initTransaction(sequelize);
initTrustMoney(sequelize);
initUser(sequelize);
