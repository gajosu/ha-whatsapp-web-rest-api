import { Request, Response } from "express-serve-static-core";

export default class MessageController {

  public constructor(
    // private readonly usersRepository: UsersRepository,
    // private readonly logger: AppLogger
  ) {}

  public async sendText(req: Request, res: Response) {
    try {
      const users = await this.usersRepository.findAll();
      res.send(users);
    } catch (e) {
      this.logger.error(e as Error);
      throw new InternalServerError("Cannot get users");
    }
  }

  public async actionCreate(req: Request, res: Response) {
    const user = await this.usersRepository.add({ id: 3, name: "Kate Lee" });
    res.send(user);
  }
}