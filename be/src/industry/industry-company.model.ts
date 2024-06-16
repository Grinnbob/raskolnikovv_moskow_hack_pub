import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Industry } from './industry.model';
import { Company } from 'src/company/company.model';

interface IndustryCompanyCreateAttrs {
  industryId: number;
  companyId: number;
}

@Table({ tableName: 'industry_companies', createdAt: false, updatedAt: false })
export class IndustryCompany extends Model<
  IndustryCompany,
  IndustryCompanyCreateAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Industry)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  industryId: number;

  @ForeignKey(() => Company)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  companyId: number;
}
