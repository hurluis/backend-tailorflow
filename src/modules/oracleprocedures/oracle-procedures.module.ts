import { Module } from '@nestjs/common';
import { OracleProceduresController } from './oracle-procedures.controller';
import { OracleProceduresService } from './oracle-procedures.service';

@Module({
  controllers: [OracleProceduresController],
  providers: [OracleProceduresService],
  exports: [OracleProceduresService]
})
export class OracleProceduresModule {}