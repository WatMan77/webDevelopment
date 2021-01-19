import { Router } from "../deps.js";
import { logging, showLogin, logO, showLogout} from "./controller/authController.js"
import { reg, showRegister } from "./controller/userController.js"
import * as behavior from "./controller/behaviourController.js"
import * as summary from "./controller/summaryController.js"
import { getRoot } from "./controller/rootContoller.js"
import * as api from "./apis/mainApi.js"


const router = new Router();

router.get('/', getRoot);
router.get('/behavior/reporting', behavior.showBehaviour);
router.post('/behavior/reporting', behavior.postBehaviour);
router.get('/behavior/summary', summary.showAverages);
router.post('/behavior/summary', summary.showChanged)
router.get('/auth/login', showLogin);
router.post('/auth/login', logging);
router.get('/auth/logout', showLogout);
router.post('/auth/logout', logO);
router.get('/auth/registration', showRegister);
router.post('/auth/registration', reg);
router.get("/api/summary", api.normalSummary);
router.get("/api/summary/:year/:month/:day", api.daySummary);

export { router }