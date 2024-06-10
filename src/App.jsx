import { Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CodeEditor from "./components/CodeEditor";
import CodeGenPage from "./components/CodeGenPage";

function App() {
  return (
    <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
      <Router>
        <Routes>
          <Route path="/" element={<CodeEditor />} />
          <Route path="/codegen" element={<CodeGenPage />} />
        </Routes>
      </Router>
    </Box>
  );
}

export default App;
