import React, { useState } from "react";
import { Box, Button, Input, VStack, Flex } from "@chakra-ui/react";

const SearchText = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPrediction = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: input,
          }),
        }
      );

      const result = await response.json();
      const generatedText = result[0]?.generated_text || "No response";

      setMessages((prevMessages) => [
        ...prevMessages,
        { query: input, response: generatedText },
      ]);
      setInput("");
    } catch (error) {
      setError("Error fetching prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="80vh"
      width="100%"
      p={4}
      mt={20}
      border="1px solid #ccc"
      borderRadius="8px"
      backgroundColor="#333333"  
      color="#FFFFFF"  
    >
      <VStack spacing={4} overflowY="auto" flex="1">
        <h2>Chat History</h2>
        {messages.map((message, index) => (
          <Box key={index} w="100%">
            <p><strong>User:</strong> {message.query}</p>
            <p><strong>GPT:</strong> {message.response}</p>
          </Box>
        ))}
      </VStack>
      <Flex mt={4} align="center">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          flex="1"
          mr={2}
          backgroundColor="#555555"  
          color="#FFFFFF" 
        />
        <Button onClick={getPrediction} disabled={loading || !input} colorScheme="blue">
          {loading ? "Loading..." : "Send"}
        </Button>
      </Flex>
      {error && <Box color="red" mt={4}>{error}</Box>}
    </Box>
  );
};

export default SearchText;
