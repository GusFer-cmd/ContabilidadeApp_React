import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { app } from "../../firebaseConfig";
import { getDatabase, ref, get } from "firebase/database";
import Menu from "../Menu/ResponsiveAppBar";
import {
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';

function RenterIndex() {
    const [renterArray, setRenterArray] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "renters");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setRenterArray(Object.values(snapshot.val()));
        } else {
            alert("Nenhum dado encontrado.");
        }
    };

    const handleCreate = () => {
        navigate("/renter/create");
        window.location.reload();
    }
    
    return (
        <Box>
            <Menu />
            <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>
                    Lista de Locatários
                </Typography>
            
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={fetchData}
                >
                    Exibir Locatários
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                >
                    Criar Locatário
                </Button>
            </Box>

                {renterArray.length > 0 ? (
                <Paper elevation={3} sx={{ p: 2 }}>
                    <List>
                        {renterArray.map((item, index) => (
                        <ListItem key={index} divider>
                            <ListItemText
                                primary={item.name}
                                secondary={
                                    <>
                                        <div><strong>Sexo:</strong> {item.assigned_sex}</div>
                                        <div><strong>Telefone:</strong> {item.telephone}</div>
                                        <div><strong>Email:</strong> {item.email}</div>
                                    </>
                                }
                            />
                        </ListItem>
                        ))}
                </List>
                </Paper>
            ) : (
                <Typography variant="body1" color="text.primary">
                    Nenhum locatário carregado ainda.
                </Typography>
            )}
        </Box>
    </Box>
    )
}

export default RenterIndex;