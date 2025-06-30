import { Box } from "@mui/material";

function CustomContainer({ children }) {
    return (
        <Box px={4} py={2}>
            {children}
        </Box>
    )
}

export default CustomContainer;