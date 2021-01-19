import { send } from "../deps.js";

const errorMiddleware = async(context, next) => {
    try {
        await next();
    } catch (e) {
        console.log(e);
    }
}

const TimeMiddleware = async({request, session}, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    const id = await session.get('id')
    const email = await session.get('email');
    const user = email ? email : ''
    const shownId = id ? id : "anonymous"
    console.log(`${request.method} ${request.url.pathname} - ${ms} ms ID: ${shownId} ${user}`)
}

const StaticFile = async(context,next) => {
    await send(context, context.request.url.pathname,{
     root: `${Deno.cwd()}/static`
      })
    await next();
   };

const SessionMiddleware = async({request, response, session}, next) => {
    let logged = await session.get('id');
    if(request.url.pathname === '/' || request.url.pathname.startsWith('/api')){
        await next();
    }
    else if(!request.url.pathname.startsWith('/auth') && !logged){
        response.redirect('/auth/login');
    } else {
        await next();
    }
}

const serveStaticFilesMiddleware = async(context, next) => {
    if (context.request.url.pathname.startsWith('/static')) {
      const path = context.request.url.pathname.substring(7);
    
      await send(context, path, {
        root: `${Deno.cwd()}/static`
      });
    
    } else {
      await next();
    }
  }

export {errorMiddleware, TimeMiddleware, SessionMiddleware, StaticFile, serveStaticFilesMiddleware}