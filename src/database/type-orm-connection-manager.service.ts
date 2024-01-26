export class TypeOrmConnectionManagerService {

  private static readonly TAG: string = `${TypeOrmConnectionManagerService.constructor.name}`;
  static reconnectionPromise: Promise<any> = null;
  static isConnection: boolean = false;
}
