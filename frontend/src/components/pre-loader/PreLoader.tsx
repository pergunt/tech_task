import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const PreLoader = () => {
  return (
    <Box paddingTop={2} textAlign="center">
      <CircularProgress color="info" size={40} />
    </Box>
  );
};

export default PreLoader;