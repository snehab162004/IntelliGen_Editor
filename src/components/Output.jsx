import { Box, Text } from "@chakra-ui/react";

const Output = ({ output, isError }) => {
  return (
    <Box
      height="78vh"
      p={5}
      mt={28}
      color={isError ? "red.400" : ""}
      border="1px solid"
      borderRadius={4}
      borderColor={isError ? "red.500" : "#333"}
    >
      {output
        ? output.map((line, i) => <Text key={i}>{line}</Text>)
        : 'Click "Run Code" to see the output here'}
    </Box>
  );
};

export default Output;
