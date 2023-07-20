import { ModalContent,ModalOverlay,Modal,Button,Box,useDisclosure,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Text } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, AvatarBadge, AvatarGroup ,Flex} from '@chakra-ui/react'
import { InfoIcon, ViewIcon } from '@chakra-ui/icons';
function ProfileModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = React.useRef(null)
    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
      } = ChatState();
    return (
      <>
        {/* <Box ref={finalRef} tabIndex={-1} aria-label='Focus moved to this box'>
          Some other content that'll receive focus on close.
        </Box> */}
        <div  onClick={onOpen}>
        <Text>
         <InfoIcon/>
        </Text>
        </div>
        
        <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
            <Flex alignContent={"center"} isCentered>
                <Box><Avatar size="xl" name={user.name} src={user.pic}></Avatar></Box>
                <Box  justifyContent={"center"} d="flex" isCentered m={8}>{user.name}</Box></Flex></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* <Lorem count={2} /> */}
              
              {user.email}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              {/* <Button variant='ghost'>Secondary Action</Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

export default ProfileModal