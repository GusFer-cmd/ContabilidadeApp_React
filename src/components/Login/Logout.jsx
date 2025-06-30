import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";

function Logout({ user }) {
    return (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
    >
        <Card sx={{ maxWidth: 400, padding: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
                <Box display="flex" justifyContent="center" mb={2}>
                    <Avatar
                    alt={user.displayName}
                    src={user.photoURL}
                    sx={{
                        width: 80,
                        height: 80,
                        border: "2px solid #3f51b5",
                        boxShadow: 3
                    }}
                    />
                </Box>
                <Typography variant="h6" gutterBottom>
                    Olá, {user.displayName}
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => signOut(auth)}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                Sair
                </Button>
            </CardContent>
        </Card>
    </Box>
  );
}

export default Logout;