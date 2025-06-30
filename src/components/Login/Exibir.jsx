import { auth } from "../../firebaseConfig";
import { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import Logout from "./Logout";
import Login from "./Login";


function Exibir() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(setUser);
    }, []);

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" mt={5}>
                <Typography variant="h4" gutterBottom>
                    Autenticação
                </Typography>
            {user ? <Logout user={user} /> : <Login />}
            </Box>
        </Container>
    )
}

export default Exibir;