import * as core from "express-serve-static-core";
import UsersController from "../"
import { IDIContainer } from "rsdi";

export default function configureRouter(app: core.Express, diContainer: IDIContainer): void {
    const usersController = diContainer.get(UsersController);
    app.route('/users')
        .get(usersController.actionIndex.bind(usersController))
        .post(usersController.actionCreate.bind(usersController));
}
