import { auth } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box
} from "@mui/material";
import { Google } from "@mui/icons-material";


function Login() {

    const navigate = useNavigate();
    
    const logGoogle = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            console.log("Logado com sucesso", result.user);
            navigate("/");
        } catch (error) {
            console.log("Erro ao logar", error);
        }
    };

    return (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={"100vh"}
    >
        <Card sx={{ maxWidth: 400, padding: 3 }}>
            <CardContent>
                <Typography textAlign="center" variant="h5" component="div" gutterBottom>
                    Contabilidade App
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Google />}
                    onClick={logGoogle}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Fazer Login com Google
                </Button>
            </CardContent>
        </Card>
    </Box>
  );
}

export default Login;