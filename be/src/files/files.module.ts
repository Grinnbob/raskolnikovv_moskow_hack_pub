import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { PinoLoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [FilesService],
  exports: [FilesService],
  imports: [PinoLoggerModule],
})
export class FilesModule {}
