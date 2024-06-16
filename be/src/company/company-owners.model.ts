import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { Company } from 'src/company/company.model';

interface CompanyOwnerCreateAttrs {
  userId: number;
  companyId: number;
}

@Table({ tableName: 'company_owners' })
export class CompanyOwners extends Model<
  CompanyOwners,
  CompanyOwnerCreateAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @ForeignKey(() => Company)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  companyId: number;
}
