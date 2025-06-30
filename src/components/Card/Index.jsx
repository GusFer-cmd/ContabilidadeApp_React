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

function Index() {
    const [cardArray, setCardArray] = useState([]);
    const navigate = useNavigate();

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "cards");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            setCardArray(Object.values(snapshot.val()));
        } else {
            alert("Nenhum dado encontrado.");
        }
    };

    const handleCreate = () => {
      navigate("/card/create");
      window.location.reload();
    } 

    return (
      <Box>
        <Menu />
        <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
              Lista de Arquivos
          </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchData}
          >
            Exibir Arquivos
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
          >
            Criar Arquivo
          </Button>
        </Box>
          {cardArray.length > 0 ? (
            <Paper elevation={3} sx={{ p: 2 }}>
              <List>
                {cardArray.map((item, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={item.title}
                      secondary={item.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            <Typography variant="body1" color="text.primary">
              Nenhuma arquivo cadastrado.
            </Typography>
          )}
        </Box>
      </Box>
    )
}

export default Index;