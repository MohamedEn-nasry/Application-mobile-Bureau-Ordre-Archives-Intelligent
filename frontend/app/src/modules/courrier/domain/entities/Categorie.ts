import { BaseEntity } from '../../../../core/base/BaseEntity';

export class Categorie extends BaseEntity {
  constructor(
    Id: string | number,
    public readonly Nom: string,
    public readonly Description: string | null
  ) {
    super(Id.toString());
  }
}