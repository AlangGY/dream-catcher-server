import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ErrorResponseDto {
  @ApiProperty({ description: '에러 코드' })
  code: string;

  @ApiProperty({ description: '에러 메시지' })
  message: string;
}

export class CommonResponseDto<T> {
  @ApiProperty({ description: '응답 상태', enum: ['success', 'error'] })
  status: 'success' | 'error';

  @ApiProperty({ description: '응답 데이터' })
  @Type(({ object }) => object.constructor)
  data: T | null;

  static success<T>(data: T): CommonResponseDto<T> {
    const response = new CommonResponseDto<T>();
    response.status = 'success';
    response.data = data;
    return response;
  }

  static error(code: string, message: string): ErrorResponseDto {
    const response = new ErrorResponseDto();
    response.code = code;
    response.message = message;
    return response;
  }
}
