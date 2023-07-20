import React from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
const ChatLoading = () => {
  return (
    <Stack>
        <Skeleton startColor='gray.500' endColor='yellow.500' height='50px' />
        <Skeleton startColor='gray.500' endColor='yellow.500' height='50px' />
        <Skeleton startColor='gray.500' endColor='yellow.500' height='50px' />
        <Skeleton startColor='gray.500' endColor='yellow.500' height='50px' />
        <Skeleton startColor='gray.500' endColor='yellow.500' height='50px' />
        <Skeleton startColor='gray.500' endColor='yellow.500' height='50px' />
        <Skeleton startColor='gray.500' endColor='yellow.500' height='50px' />


    </Stack>
  )
}

export default ChatLoading