import {
  Get,
  HttpCode,
  JsonController,
  QueryParam,
  Req,
  Res,
} from 'routing-controllers';
import { Request, Response } from 'express';
import { OpenAPI } from 'routing-controllers-openapi';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import message from '../modules/responseMessage';
import { logger } from '../utils/Logger';
import { SearchAndFilterDto } from '../dtos/ToyDto';
import { ToyService } from '../services/ToyService';

@JsonController('/toy')
export class ToyController {
  constructor(private toyService: ToyService) {}

  @HttpCode(200)
  @Get('/list/:categoryId')
  @OpenAPI({
    summary: '장난감 검색 및 필터',
    description: '검색 및 필터에 따른 장난감 조회',
    statusCode: '200',
  })
  public async searchAndFilter(
    @Req()
    req: Request,
    @Res() res: Response
  ): Promise<Response> {
    const { categoryId } = req.params;
    const searchAndFilterDto: SearchAndFilterDto = req.query;

    try {
      const searchAndFilterList = await this.toyService.searchAndFilter(
        categoryId,
        searchAndFilterDto
      );

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.READ_TOY_SUCCESS,
            searchAndFilterList
          )
        );
    } catch (error) {
      logger.error(error);
      console.log(error);

      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR
          )
        );
    }
  }

  @HttpCode(200)
  @Get('/list')
  @OpenAPI({
    summary: '장난감 검색 및 필터',
    description: '검색 및 필터에 따른 장난감 조회 (category x)',
    statusCode: '200',
  })
  public async searchAndFilterNonCategory(
    // @QueryParam('page') page: number,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Response> {
    // const offSet = page;
    const searchAndFilterDto: SearchAndFilterDto = req.query;

    try {
      const searchAndFilterList =
        await this.toyService.searchAndFilterNonCategory(
          // offSet,
          searchAndFilterDto
        );

      return res
        .status(statusCode.OK)
        .send(
          util.success(
            statusCode.OK,
            message.READ_TOY_SUCCESS,
            searchAndFilterList
          )
        );
    } catch (error) {
      logger.error(error);
      console.log(error);

      return res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(
          util.fail(
            statusCode.INTERNAL_SERVER_ERROR,
            message.INTERNAL_SERVER_ERROR
          )
        );
    }
  }
}
