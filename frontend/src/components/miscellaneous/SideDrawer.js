import React from "react";
import Navigation from "../Navigation";
import { useDisclosure, Box, useToast, Spinner } from "@chakra-ui/react";
import {
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
const SideDrawer = () => {
  const accessChat = async (userId) => {
    setLoadingChat(true);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const data = await axios.post("api/chat", { userId }, config);
      if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }; 
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const searchHandler = async () => {
    if (!search) {
      toast({
        title: "Please enter some value",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`api/user?search=${search}`, config);
      // toast({
      //   title: "Data fetched",
      //   status: "success",
      //   duration: 2000,
      //   isClosable: true,
      //   position: "bottom",
      // });

      setLoading(false);
      setSearchResult(data);
      // console.log({data})
      // console.log({searchResult});
    } catch (error) {
      toast({
        title: "Error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <div>
      <Navigation sidedrawerfunction={onOpen} />

      {/* <Button ref={btnRef} colorScheme="teal" onClick={onOpen}>
          Open
        </Button> */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search for users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={searchHandler} colorScheme="blue">
                Search
              </Button>
            </Box>
            <UserListItem />
            {/* {searchResult.map((user=>(<UserListItem/>)))} */}
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex"></Spinner>}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
