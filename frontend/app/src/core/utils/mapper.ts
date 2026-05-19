export interface Mapper<DomainEntity, DataModel> {
  toDomain(model: DataModel): DomainEntity;
  toModel(entity: DomainEntity): DataModel;
}
