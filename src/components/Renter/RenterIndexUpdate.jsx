import { app, auth } from "../../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, remove } from "firebase/database";
import {
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack
} from '@mui/material';
import ResponsiveAppBar from "../Menu/ResponsiveAppBar";

function RenterIndexUpdate() {
    const [renterArray, setRenterArray] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        auth.onAuthStateChanged(setUser);
    }, []);
    

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "renters");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
        const myData = snapshot.val();
        const temporaryArray = Object.keys(myData).map(myFiredId => ({
            ...myData[myFiredId],
            renterId: myFiredId
        }));
        setRenterArray(temporaryArray);
        } else {
        alert("Nenhum dado encontrado.");
        }
    };

    const handleCreate = () => {
        navigate("/renter/create");
        window.location.reload();
    }

    const handleEdit = (renterId) => {
        navigate(`/renter/${renterId}`);
        window.location.reload();
    };

    const handleRemove = async (renterIdParam) => {
        const db = getDatabase(app);
        const dbRef = ref(db, "renters/" + renterIdParam);
        await remove(dbRef);
        window.location.reload();
    }

    return (
        <Box>
            <ResponsiveAppBar user={user} />
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
                        <ListItem key={index} divider
                        secondaryAction={
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleEdit(item.renterId)}
                                >
                                Editar
                                </Button>
                                <Button
                                    color="error"
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleRemove(item.renterId)}
                                >
                                Remover
                                </Button>
                            </Stack>
                            }  
                            >
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
                    <Typography variant="body1" color="text.secondary">
                        Nenhum locatário carregado ainda.
                    </Typography>
                    )}
            </Box>
        </Box>
    )
}

export default RenterIndexUpdate;