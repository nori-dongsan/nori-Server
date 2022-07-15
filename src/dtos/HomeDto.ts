import { ToyDto } from "./ToyDto";

/**
 * Home Response Dto
 */
export class ResponseHomeDto {
    public trending: ToyDto[]

    public noriPick: ToyDto[]

    public senses: ToyDto[]

    public smart: ToyDto[]
}