const http = require('http');
const app = require('express')();
//app.get("/", (req, res)=> res.sendFile(_dirname + "/index"))
app.listen(9091, ()=>console.log("Listening on port 9091"))
const httpServer = http.createServer();
//httpServer = http.createServer();
const websocketServer = require('websocket').server
httpServer.listen(9090, () => console.log("Listening on 9090"));
//hashmap
const clients = {};
const games = {};
let winningCombo;
let player;
const wsServer = new websocketServer({
    "httpServer": httpServer
})
wsServer.on('request', request => {
    //connect
    const connection = request.accept(null, request.origin);
    connection.on("open", () => console.log('opened!'))
    connection.on("close", () => console.log('closed!'))
    connection.on("message", message => {
       // console.log(`message-utf8data: ${ message.utf8Data}`)
            //i have recieved a message from the client
            const result = JSON.parse(message.utf8Data)
        //   console.log(` result from message: ${result}`);
         //   user wants to create a new game
            if(result.method === "create") {
              //  console.log('received create payload')
                console.log('hi')
                const gameId = guid();
                games[gameId] = {
                        'id': gameId,
                        "balls": 20,
                        "clients": []
                }
               

                const payload = {
                    "method": "create",
                    "game": games[gameId],
                    "clientId": clientId
                }
// //console.log("result:" + result)
                const con = clients[clientId].connection
                con.send(JSON.stringify(payload))
             }
             
        if (result.method === "join") {
         // console.log('game:' + result.games[gameId])
            const clientId = result.clientId;
            const gameId = result.gameId;
            const game = games[gameId];
            console.log("game1:" + JSON.stringify(game))
            if(game.clients.length >= 2) {
                //max reached
                return;
            }
          const player = {'0': "Player1", '1': "Player2"}[game.clients.length]
          game.clients.push({
            "clientId": clientId,
            "player": player
          })
        
     if(game.clients.length === 2) {
        
            updateGame()
          }
            const payLoad = {
                "method": "join",
                "game": game
            }

//console.log("game3:" + )
          //loop through all clients and say that people have joined
          game.clients.forEach( c => {
           
            console.log("what:" + clients[c.clientId])
            clients[c.clientId].connection.send(JSON.stringify(payLoad))
          })
        }
      
        if(result.method === "play") {

            let player = result.player
            player = result.player
            const clientId = result.clientId;
            const gameId = result.gameId;
            const state = games[gameId].state;

            let id = result.cell

            games[id] = player
            //const games = response.
          //   if(!state)
          //     state = {}

          // state
        }
      

    
    })



    //generate new clientID
    const clientId = guid();
    clients[clientId] = {
        'connection': connection
    }
   
    const payload = {
        'method': "connect",
        "clientId": clientId
    }
    //send back client connection
    connection.send(JSON.stringify(payload))
})


function updateGame() {

  for (const g of Object.keys(games)) {
 
    const game = games[g]
  
    const payload = {
        "method": "update",
        "game": game
    }

   
console.log("game:" + JSON.parse(game.clients["clientId"]))
    //game.clients.forEach(c=> {
    //  console.log("test:" + JSON.stringify(game.clients[c]))
       game.clients[1]['clientId'].connection.send(JSON.stringify(payload))
       game.clients[2]['clientId'].connection.send(JSON.stringify(payload))
  //  })
}
  
  setTimeout(updateGame, 3000);
}


function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

