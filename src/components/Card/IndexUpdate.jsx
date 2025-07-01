import { app, auth } from "../../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, remove } from "firebase/database";
import ResponsiveAppBar from "../Menu/ResponsiveAppBar";
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

function IndexUpdate() {
    const [cardArray, setCardArray] = useState([]);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(setUser);
    }, []);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "cards");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const myData = snapshot.val();
          const temporaryArray = Object.keys(myData).map(myFiredId => ({
            ...myData[myFiredId],
            cardId: myFiredId
          }));
          setCardArray(temporaryArray);
          } else {
            alert("Nenhum dado encontrado.");
          }
    };

    const handleCreate = () => {
        navigate("/card/create");
        window.location.reload();
    }

    const handleEdit = (cardId) => {
        navigate(`/card/${cardId}`);
        window.location.reload();
    };

    const handleRemove = async (cardIdParam) => {
        const db = getDatabase(app);
        const dbRef = ref(db, "cards/" + cardIdParam);
        await remove(dbRef);
        window.location.reload();
    }

  return (
    <Box>
        <ResponsiveAppBar user={user} />
        <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Lista de Imóveis
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchData}
            >
              Exibir Imóveis
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
            >
              Criar Imóvel
            </Button>
          </Box>

          {cardArray.length > 0 ? (
            <Paper elevation={3} sx={{ p: 2 }}>
              <List>
                {cardArray.map((item, index) => (
                  <ListItem key={index} divider
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleEdit(item.cardId)}
                        >
                          Editar
                        </Button>
                        <Button
                          color="error"
                          variant="outlined"
                          size="small"
                          onClick={() => handleRemove(item.cardId)}
                        >
                          Remover
                        </Button>
                      </Stack>
                    }
                  >
                    <ListItemText
                      primary={item.title}
                      secondary={`${item.description}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Nenhum Imóvel carregado ainda.
            </Typography>
          )}
        </Box>
    </Box>
  );
}

export default IndexUpdate;