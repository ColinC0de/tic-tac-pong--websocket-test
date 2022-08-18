const { Console } = require('console');
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
            console.log('games[gameId' + JSON.stringify(games[gameId]))
            const game = games[gameId];
          //  console.log("game1:" + JSON.stringify(game))
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


          //loop through all clients and say that people have joined
          game.clients.forEach( c => {
         
            clients[c.clientId].connection.send(JSON.stringify(payLoad))
          })
        }
      
        if(result.method === "play") {
         
          const wCombo = result.wCombo
      
          // let combo;
            const player = result.player
            const gameId = result.gameId;
            let state = games[gameId].state;
        
             if(!state)
               state = {}
              
            const id = result.cell
            state[id] = player
            games[gameId].state = state
      

           
            games[gameId].combo = wCombo
           
           

      
        }
      
        if(result.method === 'switchPlayer') {
          const gameId = result.gameId
          const clientId = result.clientId
         //   console.log("res.cli:" , result.clientId)
             // console.log("client0" , clients[0]);
            //  console.log("client1:" , games[gameId].clients[0].clientId)
              //console.log("client2:" , games[gameId].clients[1].clientId)
            let player1id = games[gameId].clients[0].clientId;
            let player2id = games[gameId].clients[1].clientId;
            let player1 = {
              "connection": connection,
              "clientId": player1id
            }
           let  player2 = {
              "connection": connection,
              'clientId': player2id
            }
            console.log(player1);
            console.log(player2);
            console.log(clientId);
            console.log(player1id);
            console.log(player2id);

            const payload = {
              "method": "switchPlayer"
            }
            if(clientId === player1id) {
              player2[clientId].send(JSON.stringify(payload))
            } else if (clientId === player2id) {
              player1[clientId].send(JSON.stringify(payload))
            } else {
              console.log('error')
            }
        }

    
    })



    //generate new clientID
    const clientId = guid();
    console.log("c:" , clients)
    clients[clientId] = {
        'connection': connection
    }
    console.log("cc:" , clients[clientId])
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

   
    game.clients.forEach(c=> {


       clients[c.clientId].connection.send(JSON.stringify(payload))

       console.log("game:" , game)
       
       
    })
}
  
  setTimeout(updateGame, 3000);
}


function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}
 
// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
