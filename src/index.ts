import Controller from "./Libs/Controller";
import Whatsapp from "./Libs/Whatsapp";


const whatsapp = new Whatsapp();
const controller = new Controller(whatsapp);
controller.start();