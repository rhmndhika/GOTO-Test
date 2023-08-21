import React, { useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Stack,
  useColorMode,
  useMediaQuery,
  useDisclosure
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, PhoneIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';


interface Props {
  children: React.ReactNode;
}

export default function Navbar() {

  const { colorMode, toggleColorMode } = useColorMode();
 
  return (
    <>
      <Box px={4} margin="20px">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'} backgroundColor="black.200">
          <Link to="/">
            <Box cursor="pointer" fontSize="2xl" fontWeight="bold" color="red.400" textTransform="uppercase">
              Phone Book
            </Box>
          </Link>
        </Flex>
      </Box>
    </>
  );
}