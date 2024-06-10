import { useRef, useState } from "react";
import { Box, Flex, HStack, VStack, Button, useToast, Input, Textarea } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { useNavigate } from "react-router-dom"; 
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { executeCode } from "../api";
import SearchText from "./SearchText";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [theme, setTheme] = useState("vs-dark");
  const toast = useToast();
  const navigate = useNavigate();

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

  const navigateToCodeGen = () => {
    navigate("/codegen");
  };

  return (
    <Box>
      <HStack spacing={6} align="flex-start">
        <Box w="50%">
          <Flex justify="space-between" mb={2}>
            <LanguageSelector language={language} onSelect={onSelect} />
            <HStack spacing={6}>
              <Button ml={5} variant="solid" colorScheme="blue" onClick={toggleTheme}>
                Toggle Theme
              </Button>
              <Button variant="solid" colorScheme="green" isLoading={isLoading} onClick={runCode}>
                Run Code
              </Button>
              <Button variant="solid" colorScheme="teal" onClick={navigateToCodeGen}>
                Generate Code
              </Button>
              <Box w="35%">
                <Input type="file" onChange={handleFileUpload} mt={4} accept=".js,.ts,.py,.java,.cs,.php" />
              </Box>
            </HStack>
          </Flex>
          <Editor
            options={{ minimap: { enabled: false } }}
            height="78vh"
            theme={theme}
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>
      
        <Box w="25%">
          <Output editorRef={editorRef} language={language} output={output} 
          isError={isError} />
        </Box>
        <Box w="25%">
          <SearchText />
        </Box>
      </HStack>
    </Box>
  );
};

export default CodeEditor;
