import { UseCase } from "../../../../core/base/UseCase";
import { Result } from "../../../../core/utils/result";
import { AuthSession } from "../entities/AuthSession";
import { AuthRepository } from "../repositories/AuthRepository";

export interface LoginParams {
  email: string;
  password?: string;
}

export class LoginUseCase implements UseCase<AuthSession, LoginParams> {
  constructor(private authRepository: AuthRepository) {}

  async execute(params: LoginParams): Promise<Result<AuthSession>> {
    return await this.authRepository.login(params.email, params.password || "");
  }
}
