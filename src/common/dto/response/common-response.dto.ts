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
  @Type(({ object }) => (object.constructor as any)._type)
  data: T | null;

  @ApiProperty({
    description: '에러 정보',
    type: ErrorResponseDto,
    required: false,
  })
  error?: ErrorResponseDto;

  static success<T>(data: T): CommonResponseDto<T> {
    const response = new CommonResponseDto<T>();
    response.status = 'success';
    response.data = data;
    return response;
  }

  static error(code: string, message: string): CommonResponseDto<null> {
    const response = new CommonResponseDto<null>();
    response.status = 'error';
    response.data = null;
    response.error = { code, message };
    return response;
  }
}
