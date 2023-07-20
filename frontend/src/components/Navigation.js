import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, SearchIcon, BellIcon } from "@chakra-ui/icons";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import { useNavigate } from 'react-router-dom';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../config/ChatLogic";

const Links = ["Dashboard", "Projects", "Team"];
const NavLink = ({ children }) => ( 
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Navigation(props) {
  
  const Navigate=useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    Navigate("/login");
  }


  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Button variant="ghost" onClick={props.sidedrawerfunction}>
                <Tooltip label="Search users to chat">
                  <SearchIcon />
                </Tooltip>
                <Text display={{ base: "flex", md: "flex" }} px={4}>
                  Search User
                </Text>
              </Button>
            </Box>
          </HStack>
          <Text
            fontSize={"2xl"}
            fontFamily="Arial"
            display={{ base: "none", md: "flex" }}
          >
            BEST CHAT APP
          </Text>
          <Flex alignItems={"center"} m="11">
            <Menu >
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
            </Menu> 
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar m="15"
                  size={"sm"}
                  src={user.pic}
                  cursor="pointer"
                  name={user.name}
                />
              </MenuButton>
              <MenuList>
                <MenuItem><ProfileModal/> </MenuItem>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
                
    </>
  );
}
