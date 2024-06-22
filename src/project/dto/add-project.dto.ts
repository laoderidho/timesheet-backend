import { IsNotEmpty } from "class-validator";

export class AddProjectDto {
  @IsNotEmpty()
  name: string;
}