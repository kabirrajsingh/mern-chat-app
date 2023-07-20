import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react';w
import { useState } from 'react';
import axios from "axios";
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import { useToast } from "@chakra-ui/toast";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
export default function SignupCard() {
  const toast = useToast();
  const navigate=useNavigate();

  useEffect(() => {
    const userinfo=JSON.parse(localStorage.getItem("userInfo"));

    if(userinfo){
      navigate("/chats");
    }
  }, [navigate])
  
  const submitHandler=async ()=>{
    if(!name || !password || !email || !confirmpassword){
      toast({
        title:"Please fill all the fields",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      });
      setPicLoading(false);
      return;
    }
    if(password!=confirmpassword){
      toast({
        title:"Passwords do not match",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"bottom"
      })
      return;
    }
    console.log(name, email, password, pic);

    try {
      const config={
        headers:{
          "Content-type":"application/json",
        }
      }
      const {data}=await axios.post(
        "api/user",
        {
          name,
          email,
          password,
          pic
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate('/chats')
    } catch (error) {
      toast({
        title: `Error Occured!=`,
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  const [picLoading, setPicLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setname] = useState()
  const [email, setemail] = useState()
  const [password, setpassword] = useState()
  const [confirmpassword, setconfirmpassword] = useState()
  const [pic, setpic] = useState()
  return (
    <Flex
      minH={'80vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')} style={{ width: "100%" }}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to chat with Kabir ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={3}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input type="text" onChange={(e)=>setname(e.target.value)}/>
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="text"  onChange={(e)=>setemail(e.target.value)}/>
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'}  onChange={(e)=>setpassword(e.target.value)}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="confirmpassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input type={showConfirmPassword ? 'text' : 'password'}  onChange={(e)=>setconfirmpassword(e.target.value)}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() =>
                      setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword)
                    }>
                    {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Upload Your Picture</FormLabel>
              <Input type="file" accept="image/*"  onChange={(e)=>setpic(e.target.files[0])}/>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }} onClick={submitHandler} isLoading={picLoading}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <NavLink to="/login" color={'blue.400'}>Login</NavLink>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}