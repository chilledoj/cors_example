const express = require('express')

module.exports = function(opts){
  let port = opts.port
  let otherPort = opts.otherPort
  let host = opts.host
  let apiEndpoint = 'http://localhost:3000/api'
  let corsEnabled = opts.enableCors

  const app = express();
  app.set('view engine', 'pug')

  app.use(express.static('ui'))

  const notAuth = new Error("no sso-token header")

  // Ensure auth by checking for an sso-token header
  const ensureAuth = function(req,res,next){
    if( req.headers['sso-token'] == null) {
      next(notAuth)
      return
    }
    next()
  }

  app.get("/",function(req,res){
    res.render('index.pug',{
      pageTitle: `CORS Test (${port})`,
      server: `${host}:${port}/`,
      apiEndpoint,
      lnk: `${host}:${otherPort}/`
    })
  })
  /*
  CORS - determine the origins, methods and headers that are allowed for this API
  */
  function cors(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, sso-token, Content-Length, X-Requested-With');
    next()
  }
  // Mount the pre-flight request
  if(corsEnabled){
    app.options("/api", cors, function(req, res, next){
      console.log("OPTIONS route:",req.headers)
      res.sendStatus(200);
    });
  }

  // API endpoint
  app.get("/api",
    ensureAuth, 
    /*
    This is key here, without sending the CORS headers the response will still fail.
    Based upon what is passed into the server we use the CORS middleware or just a passthrough
    */
    (corsEnabled)?cors:(req,res,next)=>next(),
    function(req,res){
      console.log("GET route:",req.headers)
      res.status(200).json({"success": true, rowData: [{id: 1, name: 'test'}]})
    }
  )
  

  app.use(function (err, req, res, next) {
    if(err == notAuth){
      res.status(401).send(JSON.stringify({error:err.message}))
    }
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  app.listen(port,function(){
    console.log("Started http on port %d",port)
  })
}