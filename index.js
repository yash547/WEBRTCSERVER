const http = require("http")
const Socket = require("websocket").server
const server = http.createServer(() => { })


server.listen(9982, () => {

})

const webSocket = new Socket({ httpServer: server })

const users = []

webSocket.on('request', (req) => {
    const connection = req.accept()


    connection.on('message', (message) => {
        const data = JSON.parse(message.utf8Data)
        console.log(data);
        const user = findUser(data.name)
        switch (data.type) {
            case "store_user":
                // if (user != null) {


                //     console.log("user already exists" + users.length)
                //     //our user exists
                //     connection.send(JSON.stringify({
                //         type: 'user already exists'
                //     }))
                //     return

                // }

                const newUser = {
                    name: data.name, conn: connection
                }
                users.push(newUser)

                console.log("added data=" + users.length)

                connection.send(JSON.stringify({
                    type: 'store_user_startCall'
                }))


                break

            case "start_call":
                let userToCall = findUser(data.target)

                if (userToCall) {
                    connection.send(JSON.stringify({
                        type: "call_response", data: "user is ready for call"
                    }))
                } else {
                    connection.send(JSON.stringify({
                        type: "call_response", data: "user is not online"
                    }))
                }

                break

            case "create_offer":
                let userToReceiveOffer = findUser(data.target)

                /**
                 * the below code is used to provide the amount of response you want to deliver to another user.
                 * 
                 */

                if (userToReceiveOffer) {
                    userToReceiveOffer.conn.send(JSON.stringify({
                        type: "offer_received",
                        name: data.name,
                        intakeFormMsg: data.intakeFormMsg,
                        data: data.data.sdp
                    }))
                }
                break

            case "create_answer":
                let userToReceiveAnswer = findUser(data.target)
                if (userToReceiveAnswer) {
                    userToReceiveAnswer.conn.send(JSON.stringify({
                        type: "answer_received",
                        name: data.name,
                        data: data.data.sdp
                    }))
                }
                break

            case "countdown_update":
                let userToReceiveCountDown = findUser(data.target)
                if (userToReceiveCountDown) {
                    userToReceiveCountDown.conn.send(JSON.stringify({
                        type: "countdown_receive_update",
                        videoCallTimesLeft: data.videoCallTimesLeft
                    }))
                }

                break

            /**
             *  The below code is used to disconnect the video call from business to user
             * 
             */

            case "endVideoCallConnection":
                let userEndVideoCallConnection = findUser(data.target)
                if (userEndVideoCallConnection) {
                    userEndVideoCallConnection.conn.send(JSON.stringify({
                        type: "endVideoCallConnection_Update"
                    }))

                }

                break

            case "endVideoCallConnectionuser":
                let userEndVideoCallConnectionuser = findUser(data.target)
                if (userEndVideoCallConnectionuser) {
                    userEndVideoCallConnectionuser.conn.send(JSON.stringify({
                        type: "endVideoCallConnection_Updateuser"
                    }))

                }

                break



            case "ice_candidate":
                let userToReceiveIceCandidate = findUser(data.target)
                if (userToReceiveIceCandidate) {
                    userToReceiveIceCandidate.conn.send(JSON.stringify({
                        type: "ice_candidate",
                        name: data.name,
                        data: {
                            sdpMLineIndex: data.data.sdpMLineIndex,
                            sdpMid: data.data.sdpMid,
                            sdpCandidate: data.data.sdpCandidate
                        }
                    }))
                }
                break



            case "create_voice_offer":
                let userToVoiceReceiveOffer = findUser(data.target)

                /**
                 * the below code is used to provide the amount of response you want to deliver to another user.
                 * 
                 */

                if (userToVoiceReceiveOffer) {
                    userToVoiceReceiveOffer.conn.send(JSON.stringify({
                        type: "offer_voice_received",
                        name: data.name,
                        intakeFormMsg: data.intakeFormMsg,
                        data: data.data.sdp
                    }))
                }
                break

            case "create_voice_answer":
                let userToVoiceReceiveAnswer = findUser(data.target)
                if (userToVoiceReceiveAnswer) {
                    userToVoiceReceiveAnswer.conn.send(JSON.stringify({
                        type: "answer_voice_received",
                        name: data.name,
                        data: data.data.sdp
                    }))
                }
                break


            case "countdown_voice_update":
                let userToVoiceReceiveCountDown = findUser(data.target)
                if (userToVoiceReceiveCountDown) {
                    userToVoiceReceiveCountDown.conn.send(JSON.stringify({
                        type: "countdown_voice_receive_update",
                        videoCallTimesLeft: data.videoCallTimesLeft
                    }))
                }

                break


            case "endVoiceCallConnectionuser":
                let userEndVoiceCallConnectionuser = findUser(data.target)
                if (userEndVoiceCallConnectionuser) {
                    userEndVoiceCallConnectionuser.conn.send(JSON.stringify({
                        type: "endVoiceCallConnection_Updateuser"
                    }))

                }

                break


            case "store_chat_user":
                if (user != null) {


                    console.log("user already exists" + users.length)
                    //our user exists
                    connection.send(JSON.stringify({
                        type: 'user chat already exists'
                    }))
                    return

                }

                const newChatUser = {
                    name: data.name, conn: connection
                }
                users.push(newChatUser)

                console.log("added data=" + users.length)

                connection.send(JSON.stringify({
                    type: 'store_user_chatCall'
                }))


                break


            case "start_chat_call":
                let userToChat = findUser(data.target)

                if (userToChat) {
                    connection.send(JSON.stringify({
                        type: "call_chat_response", data: "user is ready for chat"
                    }))
                } else {
                    connection.send(JSON.stringify({
                        type: "call_chat_response", data: "user is not online Chat"
                    }))
                }

                break


            case "create_chat_offer":
                let userToReceivechatOffer = findUser(data.target)

                /**
                 * the below code is used to provide the amount of response you want to deliver to another user.
                 * 
                 */

                if (userToReceivechatOffer) {
                    userToReceivechatOffer.conn.send(JSON.stringify({
                        type: "offer_chat_received",
                        name: data.name,
                        intakeFormMsg: data.intakeFormMsg,
                        data: data.data.sdp
                    }))
                }
                break

            case "create_chat_answer":
                let userToChatReceiveAnswer = findUser(data.target)
                if (userToChatReceiveAnswer) {
                    userToChatReceiveAnswer.conn.send(JSON.stringify({
                        type: "answer_chat_received",
                        name: data.name,
                        intakeFormMsg: data.intakeFormMsg, // changes done 23-01-2024
                        data: data.data.sdp
                    }))
                }
                break



            case "tyingAxpertzUpdate":
                let userToChatTypingReceiveAnswer = findUser(data.target)
                if (userToChatTypingReceiveAnswer) {
                    userToChatTypingReceiveAnswer.conn.send(JSON.stringify({
                        type: "answer_tUpdate_business_received",
                        name: data.name,
                        intakeFormMsg: data.intakeFormMsg
                    }))
                }
                break


            case "tyingAxpertzUser":
                let userToChatTypingReceivesAnswer = findUser(data.target)
                if (userToChatTypingReceivesAnswer) {
                    userToChatTypingReceivesAnswer.conn.send(JSON.stringify({
                        type: "answer_tUpdate_user_received",
                        name: data.name,
                        intakeFormMsg: data.intakeFormMsg
                    }))
                }
                break





            case "refreshAxpertzUpdate":
                let userToChatRefreshReceiveAnswer = findUser(data.target)
                if (userToChatRefreshReceiveAnswer) {
                    userToChatRefreshReceiveAnswer.conn.send(JSON.stringify({
                        type: "answer_tUpdatereferesh_business_received",
                        name: data.name
                    }))
                }
                break



            case "refereshAxpertzUser":
                let userToChatrefereshReceivesAnswer = findUser(data.target)
                if (userToChatrefereshReceivesAnswer) {
                    userToChatrefereshReceivesAnswer.conn.send(JSON.stringify({
                        type: "answer_tUpdatereferesh_user_received",
                        name: data.name
                    }))
                }
                break


            case "countdown_chat_update":
                let userTochatReceiveCountDown = findUser(data.target)
                if (userTochatReceiveCountDown) {
                    userTochatReceiveCountDown.conn.send(JSON.stringify({
                        type: "countdown_chat_receive_update",
                        videoCallTimesLeft: data.videoCallTimesLeft
                    }))
                }

                break

            case "endConsultancyChatConnection":
                let userToconsultancyEndChat = findUser(data.target)
                if (userToconsultancyEndChat) {
                    userToconsultancyEndChat.conn.send(JSON.stringify({
                        type: "endConsultancyChatConnectionUpdate",
                        name: data.name
                    }))

                }

                break

            case "endConsultancyChatConnectionBusiness":
                let userToconsultancyEndChatBusiness = findUser(data.target)
                if (userToconsultancyEndChatBusiness) {
                    userToconsultancyEndChatBusiness.conn.send(JSON.stringify({
                        type: "endConsultancyChatConnectionBusinessUpdate",
                        name: data.name
                    }))

                }

                break



            /**
             * 
             *  The below code is for re-connecting.
             * 
             */


            // case "create_offer_rev":
            //     let userReToReceiveOffer = findUser(data.target)

            //     /**
            //      * the below code is used to provide the amount of re-response you want to deliver to another user.
            //      * 
            //      */

            //     if (userReToReceiveOffer) {

            //         console.log("inside userReToReceiveOffer=", userReToReceiveOffer);

            //         userReToReceiveOffer.conn.send(JSON.stringify({
            //             type: "offer_received_rev",
            //             name: data.name,
            //             intakeFormMsg: data.intakeFormMsg,
            //             data: data.data.sdp
            //         }))

            //         console.log("inside1 userReToReceiveOffer=", userReToReceiveOffer);

            //     }
            //     else {

            //         console.log("else userReToReceiveOffer=", userReToReceiveOffer);
            //     }
            //     break



            // case "create_answer_rev":
            //     let userToReceiveAnswerRe = findUser(data.target)
            //     if (userToReceiveAnswerRe) {

            //         console.log("inside create_answer_rev=", userToReceiveAnswerRe);

            //         userToReceiveAnswerRe.conn.send(JSON.stringify({
            //             type: "answer_received_rev",
            //             name: data.name,
            //             data: data.data.sdp
            //         }))

            //         console.log("inside1 create_answer_rev=", userToReceiveAnswerRe);
            //     }
            //     else {

            //         console.log("else create_answer_rev=", userToReceiveAnswerRe);

            //     }
            //     break



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


    connection.on('closeEndUser', () => {
        // Find the user associated with the closed connection
        const closedUser = users.find(user => user.conn === connection);

        if (closedUser) {

            closedUser.conn.send(JSON.stringify({
                type: "BusinessEnd"
            }))
          
        }
    });


})

const findUser = username => {
    for (let i = 0; i < users.length; i++) {
        if (users[i].name === username)
            return users[i]
    }
}