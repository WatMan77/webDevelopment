import { Application, viewEngine, engineFactory, adapterFactory, Session } from "./deps.js"
import * as middleware from './middleware/middleware.js'
import { router } from "./routes/routes.js"

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
    viewRoot: "./views"
}));

app.use(session.use()(session));

app.use(middleware.errorMiddleware);
app.use(middleware.TimeMiddleware);
app.use(middleware.SessionMiddleware);
app.use(middleware.serveStaticFilesMiddleware);
app.use(router.routes());

//app.use(middleware.StaticFile);

/*let port = 7777;
if (Deno.args.length > 0) {  const lastArgument = Deno.args[Deno.args.length - 1];  port = Number(lastArgument);}
app.listen({ port: port });*/
if (!Deno.env.get('TEST_ENVIRONMENT')) {
    app.listen({ port: 7777 });
  }

export { app };