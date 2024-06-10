import React, { useState } from "react";
import { Box, VStack, Textarea, Button, useToast } from "@chakra-ui/react";
import { generateCode } from "./CodeGen"; 

const CodeGenPage = () => {
  const [generatedCode, setGeneratedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleGenerateCode = async () => {
    try {
      setIsLoading(true);
      const result = await generateCode({ inputs: "write a program for adding 2 numbers" });
      setGeneratedCode(result);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to generate code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <VStack spacing={4}>
        <Textarea
          value={generatedCode}
          onChange={(e) => setGeneratedCode(e.target.value)}
          placeholder="Generated code will appear here"
          size="sm"
          height="50vh"
        />
        <Button colorScheme="teal" isLoading={isLoading} onClick={handleGenerateCode}>
          Generate Code
        </Button>
      </VStack>
    </Box>
  );
};

export default CodeGenPage;
