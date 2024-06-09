import { useRef, useState } from "react";
import { Box, Flex, HStack, VStack, Button, useToast, Input, Textarea } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { executeCode } from "../api";
import SearchText from "./SearchText";
import { generateCode } from "./CodeGen";  // Correct import

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [theme, setTheme] = useState("vs-dark");
  const [generatedCode, setGeneratedCode] = useState("");
  const toast = useToast();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "vs-dark" ? "light" : "vs-dark"));
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileRead = (file) => {
    const allowedExtensions = ["js", "ts", "py", "java", "cs", "php"];
    const fileExtension = file.name.split(".").pop();
    if (!allowedExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type.",
        description: "Only JS, TS, Python, Java, C#, and PHP files are allowed.",
        status: "error",
        duration: 6000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setValue(e.target.result);
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const generateAIcode = async () => {
    try {
      setIsLoading(true);
      const result = await generateCode({
        inputs: "Write a program to check if something is palindrome",
      });
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
      <HStack spacing={4} align="flex-start">
        <Box w="50%">
          <Flex justify="space-between" mb={2}>
            <LanguageSelector language={language} onSelect={onSelect} />
            <HStack spacing={4}>
              <Button variant="solid" colorScheme="blue" onClick={toggleTheme}>
                Toggle Theme
              </Button>
              <Button variant="solid" colorScheme="green" isLoading={isLoading} onClick={runCode}>
                Run Code
              </Button>
              <Button variant="solid" colorScheme="teal" isLoading={isLoading} onClick={generateAIcode}>
                Generate Code
              </Button>
            </HStack>
          </Flex>
          <Editor
            options={{ minimap: { enabled: false } }}
            height="80vh"
            theme={theme}
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
          <Input type="file" onChange={handleFileUpload} mt={4} accept=".js,.ts,.py,.java,.cs,.php" />
        </Box>
        <Box w="25%">
          <Output editorRef={editorRef} language={language} output={output} isError={isError} />
        </Box>
        <Box w="25%">
          <SearchText />
          <VStack mt={4} spacing={4}>
            <Textarea
              value={generatedCode}
              onChange={(e) => setGeneratedCode(e.target.value)}
              placeholder="Generated code will appear here"
              size="sm"
              height="50vh"
            />
          </VStack>
        </Box>
      </HStack>
    </Box>
  );
};

export default CodeEditor;
