import { Card, CardContent, Typography, Button, Box, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";

function CardItem({ title, description, currentDate, firebaseId }) {
    
    const navigate = useNavigate();

    const handlePayment = () => {
        navigate(`/info/index/${firebaseId}`);
    };

    return (
        <Card
            sx={{
                width: "300px",
                maxWidth: 600,
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                },
            }}
        >

            <CardMedia
                component="img"
                height="200"
                image="/banner.jpg"
                alt="Banner"
            />
                

            <CardContent>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "bold", color: "#333" }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    {description}
                </Typography>
                <Box display="flex" justifyContent="flex-start">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handlePayment}
                        sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                        Pagamento
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

export default CardItem;