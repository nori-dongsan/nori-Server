import { Get, HttpCode, JsonController, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Response } from 'express';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import message from '../modules/responseMessage';
import { HomeService } from '../services/HomeService';
import { logger } from '../utils/Logger';

@JsonController('/home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @HttpCode(200)
  @Get('')
  @OpenAPI({
    summary: '홈 데이터 조회',
    description: '메인 화면 데이터 반환',
    statusCode: '200',
  })
  public async getData(@Res() res: Response): Promise<Response> {
    try {
      const list = await this.homeService.fetchList();

      return res
        .status(statusCode.OK)
        .send(
          util.success(statusCode.OK, message.FETCH_HOME_DATA_SUCCESS, list)
        );
    } catch (err) {
      logger.error(err);

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
