import { Box, Button, Card, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { type FC, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import 'twin.macro';

import { useSorobanReact } from "@soroban-react/core";
import * as StellarSdk from '@stellar/stellar-sdk';

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts';
import { Address, nativeToScVal, xdr } from '@stellar/stellar-sdk';

export const ManageTitle: FC = () => {
  const sorobanContext = useSorobanReact();
  const { activeChain, server, address } = sorobanContext; // Aquí se obtiene la dirección del contexto

  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [adminAddress, setAdminAddress] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newUser, setNewUser] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const contract = useRegisteredContract("title");

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

  useEffect(() => {
    fetchTitle();
    fetchAdminAddress();
  }, [fetchTitle, fetchAdminAddress]);

  const modifyTitle = async () => {
    if (!newTitle) {
      toast.error('Please enter a new title.');
      return;
    }
    if (!server || !contract || !address) return; // Verificamos que la dirección esté definida

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
    if (!server || !contract || !address) return; // También verificamos que la dirección esté definida

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
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error('You are not the admin, you are not authorized for this.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card variant="outline" p={4} bgColor="whiteAlpha.100">
      <FormControl>
        <FormLabel>Current Title</FormLabel>
        <Text>{currentTitle || "No Title Set"}</Text>
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Admin Address</FormLabel>
        <Text>{adminAddress || "No Admin Set"}</Text>
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>New Title</FormLabel>
        <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <Button mt={4} onClick={modifyTitle} isLoading={isLoading} colorScheme="blue">
          Modify Title
        </Button>
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>New User Address</FormLabel>
        <Input value={newUser} onChange={(e) => setNewUser(e.target.value)} />
        <Button mt={4} onClick={addUser} isLoading={isLoading} colorScheme="green">
          Add User
        </Button>
      </FormControl>
    </Card>
  );
};
