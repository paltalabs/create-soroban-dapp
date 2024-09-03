import { Box, Button, Card, FormControl, FormLabel, Input, Text, VStack, Heading } from '@chakra-ui/react';
import { type FC, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import 'twin.macro';

import { useSorobanReact } from "@soroban-react/core";
import * as StellarSdk from '@stellar/stellar-sdk';

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts';
import { Address, nativeToScVal, xdr } from '@stellar/stellar-sdk';

export const ManageTitle: FC = () => {
  const sorobanContext = useSorobanReact();
  const { activeChain, server, address } = sorobanContext;

  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [adminAddress, setAdminAddress] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newUser, setNewUser] = useState<string>('');
  const [newAdmin, setNewAdmin] = useState<string>('');
  const [authorizedUsers, setAuthorizedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const contract = useRegisteredContract("title");

  // 1. Implementación del estado reactivo para la lista de usuarios autorizados
  const fetchTitle = useCallback(async () => {
    if (!server || !contract) return;

    try {
      const result = await contract.invoke({
        method: "get_title",
        signAndSend: false
      });
      const title = StellarSdk.scValToNative(result as xdr.ScVal) as string;
      setCurrentTitle(title);
    } catch (error) {
      console.error("Error fetching title:", error);
      toast.error('Error fetching title.');
    }
  }, [server, contract]);

  const fetchAdminAddress = useCallback(async () => {
    if (!server || !contract) return;

    try {
      const result = await contract.invoke({
        method: "address_admin",
        signAndSend: false
      });
      const admin = StellarSdk.scValToNative(result as xdr.ScVal) as string;
      setAdminAddress(admin);
    } catch (error) {
      console.error("Error fetching admin address:", error);
      toast.error('Error fetching admin address.');
    }
  }, [server, contract]);

  const fetchAuthorizedUsers = useCallback(async () => {
    if (!server || !contract) return;

    try {
      const result = await contract.invoke({
        method: "get_users",
        signAndSend: false
      });
      const users = StellarSdk.scValToNative(result as xdr.ScVal) as string[];
      setAuthorizedUsers(users);
    } catch (error) {
      console.error("Error fetching authorized users:", error);
      toast.error('Error fetching authorized users.');
    }
  }, [server, contract]);

  // Intervalo para actualización automática de usuarios autorizados
  useEffect(() => {
    fetchTitle();
    fetchAdminAddress();
    const intervalId = setInterval(fetchAuthorizedUsers, 1000); // Actualización cada 1 segundo

    return () => clearInterval(intervalId); // Limpieza del intervalo
  }, [fetchTitle, fetchAdminAddress, fetchAuthorizedUsers]);

  const modifyTitle = async () => {
    if (!newTitle) {
      toast.error('Please enter a new title.');
      return;
    }
    if (!server || !contract || !address) return;

    setIsLoading(true);
    try {
      await contractInvoke({
        contractAddress: contract.deploymentInfo.contractAddress,
        method: "modify_title",
        args: [new Address(address).toScVal(), nativeToScVal(newTitle, { type: "string" })],
        signAndSend: true,
        sorobanContext
      });
      toast.success("Title modified.");
      setCurrentTitle(newTitle);

      // Limpieza del campo de entrada
      setNewTitle('');
    } catch (error) {
      console.error("Error modifying title:", error);
      toast.error('User not authorized.');
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async () => {
    if (!newUser) {
      toast.error('Please enter a new user address.');
      return;
    }
    if (!server || !contract || !address) return;

    setIsLoading(true);
    try {
      await contractInvoke({
        contractAddress: contract.deploymentInfo.contractAddress,
        method: "add_user",
        args: [new Address(newUser).toScVal()],
        signAndSend: true,
        sorobanContext
      });
      toast.success("User added.");

      // Limpieza del campo de entrada
      setNewUser('');
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error('You are not the admin, you are not authorized for this.');
    } finally {
      setIsLoading(false);
    }
  };

  const modifyAdmin = async () => {
    if (!newAdmin) {
      toast.error('Please enter a new admin address.');
      return;
    }
    if (!server || !contract || !address) return;

    setIsLoading(true);
    try {
      await contractInvoke({
        contractAddress: contract.deploymentInfo.contractAddress,
        method: "modify_admin",
        args: [new Address(newAdmin).toScVal()],
        signAndSend: true,
        sorobanContext
      });
      toast.success("Admin modified.");
      setAdminAddress(newAdmin);

      // Limpieza del campo de entrada
      setNewAdmin('');
    } catch (error) {
      console.error("Error modifying admin:", error);
      toast.error('You are not authorized for this.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="outline" p={4} bgColor="whiteAlpha.100">
      {/* Aplicación de estilos para los títulos */}
      <FormControl>
        <FormLabel as="h2" fontSize="lg" fontWeight="bold">Current Title</FormLabel>
        <Text as="p">{currentTitle || "No Title Set"}</Text>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel as="h2" fontSize="lg" fontWeight="bold">Authorized Users</FormLabel>
        <VStack align="start">
          {authorizedUsers.length > 0 ? (
            authorizedUsers.map((user, idx) => <Text as="p" key={idx}>{user}</Text>)
          ) : (
            <Text as="p">No Authorized Users</Text>
          )}
        </VStack>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel as="h2" fontSize="lg" fontWeight="bold">Admin Address</FormLabel>
        <Text as="p">{adminAddress || "No Admin Set"}</Text>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel as="h2" fontSize="lg" fontWeight="bold">New Title</FormLabel>
        <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <Button mt={4} onClick={modifyTitle} isLoading={isLoading} colorScheme="blue">
          Modify Title
        </Button>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel as="h2" fontSize="lg" fontWeight="bold">New User Address</FormLabel>
        <Input value={newUser} onChange={(e) => setNewUser(e.target.value)} />
        <Button mt={4} onClick={addUser} isLoading={isLoading} colorScheme="green">
          Add User
        </Button>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel as="h2" fontSize="lg" fontWeight="bold">New Admin Address</FormLabel>
        <Input value={newAdmin} onChange={(e) => setNewAdmin(e.target.value)} />
        <Button mt={4} onClick={modifyAdmin} isLoading={isLoading} colorScheme="red">
          Modify Admin
        </Button>
      </FormControl>
    </Card>
  );
};