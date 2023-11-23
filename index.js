const http = require("http")
const Socket = require("websocket").server
const server = http.createServer(()=>{})

server.listen(9982,"192.168.43.208",()=>{
    
})

const webSocket = new Socket({httpServer:server})

const users = []

webSocket.on('request',(req)=>{
    const connection = req.accept()
   

    connection.on('message',(message)=>{
        const data = JSON.parse(message.utf8Data)
        console.log(data);
        const user = findUser(data.name)
        switch(data.type){
            case "store_user":
                if(user !=null){

                    
                console.log("user already exists"+users.length)
                    //our user exists
                    connection.send(JSON.stringify({
                        type:'user already exists'
                    }))
                    return

                }

                const newUser = {
                    name:data.name, conn: connection
                }
                users.push(newUser)

                console.log("added data="+users.length)

                connection.send(JSON.stringify({
                    type:'store_user_startCall'
                }))
                

            break

            case "start_call":
                let userToCall = findUser(data.target)

                if(userToCall){
                    connection.send(JSON.stringify({
                        type:"call_response", data:"user is ready for call"
                    }))
                } else{
                    connection.send(JSON.stringify({
                        type:"call_response", data:"user is not online"
                    }))
                }

            break
            
            case "create_offer":
                let userToReceiveOffer = findUser(data.target)

                /**
                 * the below code is used to provide the amount of response you want to deliver to another user.
                 * 
                 */

                if (userToReceiveOffer){
                    userToReceiveOffer.conn.send(JSON.stringify({
                        type:"offer_received",
                        name:data.name,
                        intakeFormMsg : data.intakeFormMsg,
                        data:data.data.sdp
                    }))
                }
            break
                
            case "create_answer":
                let userToReceiveAnswer = findUser(data.target)
                if(userToReceiveAnswer){
                    userToReceiveAnswer.conn.send(JSON.stringify({
                        type:"answer_received",
                        name: data.name,
                        data:data.data.sdp
                    }))
                }
            break

            case "countdown_update":
                 let userToReceiveCountDown = findUser(data.target)
                 if(userToReceiveCountDown){
                    userToReceiveCountDown.conn.send(JSON.stringify({
                        type:"countdown_receive_update",
                        videoCallTimesLeft:data.videoCallTimesLeft
                    }))
                 }

            break    
            
            case "endVideoCallConnection":
                let userEndVideoCallConnection = findUser(data.target)
                if(userEndVideoCallConnection)
                {
                    userEndVideoCallConnection.conn.send(JSON.stringify({
                        type:"endVideoCallConnection_Update"
                    }))

                }
            
                break

            case "ice_candidate":
                let userToReceiveIceCandidate = findUser(data.target)
                if(userToReceiveIceCandidate){
                    userToReceiveIceCandidate.conn.send(JSON.stringify({
                        type:"ice_candidate",
                        name:data.name,
                        data:{
                            sdpMLineIndex:data.data.sdpMLineIndex,
                            sdpMid:data.data.sdpMid,
                            sdpCandidate: data.data.sdpCandidate
                        }
                    }))
                }
            break


        }

    })
    
    // connection.on('close', () =>{

    //     users.forEach( user => {
    //         if(user.conn === connection){
    //             users.splice(users.indexOf(user),1)
    //         }
    //     })
        
    //     connection.close()
    // })
    
    connection.on('close', () => {
        // Find the user associated with the closed connection
        const closedUser = users.find(user => user.conn === connection);
    
        if (closedUser) {
            // Perform cleanup for the peerConnection
            // For example, close the peerConnection or handle other cleanup tasks
            // Assuming you have a peerConnection property in your user object
            if (closedUser.peerConnection) {
                closedUser.peerConnection.close();
            }
    
            // Remove the user from the users array
            const index = users.indexOf(closedUser);
            if (index !== -1) {
                users.splice(index, 1);
            }
    
            // Close the WebSocket connection
            connection.close();
        }
    });
    


})

const findUser = username =>{
    for(let i=0; i<users.length;i++){
        if(users[i].name === username)
        return users[i]
    }
}