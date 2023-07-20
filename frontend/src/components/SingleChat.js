import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Text,
  Box,
  IconButton,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { useState } from "react";
import { useEffect } from "react";
import { Spinner } from "@chakra-ui/react";
import ScrollableChat from "./ScrollableChat";
import Lottie from 'react-lottie';
import axios from "axios";
import animationData from '../animations/typing.json';
import io from 'socket.io-client';
const ENDPOINT='http://127.0.0.1:8080';
var socket,selectedChatCompare;


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat ,notification,setNotification} = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [typing, setTyping] = useState()
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        (`api/message/${selectedChat._id}`), 
        config
      );
      // console.log(messages);
      setMessages(data);
      setLoading(false);

      
      socket.emit("join chat",selectedChat._id); 
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  
  const sendMessage = async (event) => {
    if (event.key == "Enter" && newMessage) {
      socket.emit('stop typing',selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post( 
          "api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        // console.log(data);


        socket.emit("new message",data); 
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket=io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connected",()=>setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false)); 
  }, [])


  useEffect(() => {
    selectedChatCompare=selectedChat;
    fetchMessages()
  
  }, [selectedChat])
  console.log(notification,"notificiaotnnn---------------------")

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      
      
      if ( 
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {    
        
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  



  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                ></UpdateGroupChatModal>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent={"flex-end"}    
            p={3}   
            background="#e6f3f6"
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="sm"
                h={20}
                w={20}
                alignSelf="center"
                margin="auto"
              ></Spinner>
            ) : (
              <div display="flex" flexDir="column" overflowY="scroll">
                <ScrollableChat messages={messages}></ScrollableChat>

              </div>
            )}
            <FormControl onKeyDown={sendMessage}>
              {isTyping?(<div>
                <Lottie
                  options={defaultOptions}
                  width={70}
                  style={{marginBottom:15,marginLeft:0}}
                />
              </div>):(<></>)}
              <Input
                variant="filled"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              ></Input>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize={"3xl"}> Click on a chat to start chatting</Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
