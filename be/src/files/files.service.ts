import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as pdf from 'pdf-creator-node';
import HTMLtoDOCX from 'html-to-docx';
import { Resume } from 'src/resume/resume.model';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { CONFIG_PDF } from 'src/utils/constants';
import { PinoLoggerService } from 'src/logger/logger.service';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'heic', 'gif'];

@Injectable()
export class FilesService {
  constructor(private readonly logger: PinoLoggerService) {
    this.logger.setContext(FilesService.name);
  }

  private getExtension(file: Express.Multer.File): string {
    const extension = file.originalname.split('.').pop()
    .split('.')
    .filter(Boolean) 
    .slice(1)
    .join('.'); 

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      this.logger.warn(`Warning! Strange extension: ${extension}`);
      throw new HttpException(
        `Image extension not allowed: ${extension}, allowed: ${allowed_extensions.join(
          ', ',
        )}`,
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }

    return '.' + extension;
  }

  public async upsert(
    file: Express.Multer.File,
    folder = '/',
    filePrefix?: string, 
    oldFileName?: string,
  ): Promise<string> {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', folder);

      
      const fileExists = await fs.promises
        .access(path.join(filePath, oldFileName ?? ''), fs.constants.F_OK)

      if (oldFileName && fileExists) {
        await this.delete(oldFileName);
      }
      const fileExtension = this.getExtension(file);
      const fileName = filePrefix + uuid.v4() + fileExtension;

      
      const folderExists = await fs.promises
        .access(filePath, fs.constants.F_OK)

      if (!folderExists) {
        await fs.promises.mkdir(filePath, { recursive: true });
      }
      await this.delete(fileName);

      return fileName;
    } catch (e) {
      this.logger.error(
        `File saving error for filePrefix: ${filePrefix}: ${e}`,
      );
      throw new HttpException(
        `File saving error for filePrefix: ${filePrefix}: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async delete(fileName?: string, folder = '/'): Promise<void> {
    try {
      if (!fileName) {
        this.logger.warn(`Empty fileName provided: ${fileName}`);
        return;
      }

      const filePath = path.resolve(__dirname, '..', 'static', folder);
      const fullFilePath = path.join(filePath, fileName);
      const fileExists = await fs.promises
        .access(fullFilePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

      if (!fileExists) {
        this.logger.warn(`File ${fileName} already deleted or not found`);
        return;
      }

      await fs.promises.unlink(fullFilePath);
    } catch (e) {
      this.logger.error(`Can't delete file: ${fileName}, error: ${e}`);
      throw new HttpException(
        `Can't delete file: ${fileName}, error: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async deleteAllByPrefix(prefix?: string, folder = '/'): Promise<void> {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', folder);
      const allFiles = await fs.promises.readdir(filePath);
      for (const fileName of allFiles) {
        if (fileName.startsWith(prefix)) {
          const fullFilePath = path.join(filePath, fileName);
          await fs.promises.unlink(fullFilePath);
        }
      }
    } catch (e) {
      this.logger.error(`Can't delete files by prefix: ${prefix}, error: ${e}`);
      throw new HttpException(
        `Can't delete files by prefix: ${prefix}, error: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createPDF(
    document: Resume | Vacancy,
    html: string,
    prefix: string,
    folder = '/',
  ): Promise<string> {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', folder);
      const fileName = prefix + uuid.v4() + '.pdf';
      const fullFilePath = path.join(filePath, fileName);

      const folderExists = await fs.promises
        .access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

      if (!folderExists) {
        await fs.promises.mkdir(filePath, { recursive: true });
      }

      const doc = {
        html: html,
        data: {
          user: document.user,
          document: document,
        },
        path: fullFilePath,
        type: '',
      };

      await pdf.create(doc, CONFIG_PDF);
      return fileName;
    } catch (e) {
      this.logger.error(
        `Can't create PDF for userId: ${document.userId}, prefix: ${prefix}, error: ${e}`,
      );
      throw new HttpException(
        `Can't create PDF for userId: ${document.userId}, prefix: ${prefix}, error: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async createDOCX(
    html: string,
    prefix: string,
    folder = '/',
  ): Promise<string> {
    try {
      const filePath = path.resolve(__dirname, '..', 'static', folder);
      const fileName = prefix + uuid.v4() + '.docx';

      const folderExists = await fs.promises
        .access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

      if (!folderExists) {
        await fs.promises.mkdir(filePath, { recursive: true });
      }

      const fileBuffer = await HTMLtoDOCX(html, null, {
        table: { row: { cantSplit: true } },
        footer: true,
        pageNumber: true,
      });

      await fs.promises.writeFile(path.join(filePath, fileName), fileBuffer);

      return fileName;
    } catch (e) {
      this.logger.error(`Can't create DOCX for prefix: ${prefix}, error: ${e}`);
      throw new HttpException(
        `Can't create DOCX for prefix: ${prefix}, error: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
