import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import "./css/MovieCard.scss"; // Ensure you have the CSS for hover effects

function MovieCard({ movie, setTriggerRefresh }) {
  return (
    <Card className="movie-card">
      <CardMedia
        component="img"
        image={movie.photoUrl || '/default-movie.jpg'} // Fallback to a default image if photoUrl is not available
        alt={movie.title}
        className="movie-card-image"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Director: {movie.director}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {movie.category}
        </Typography>
        {/* Add more details as needed */}
      </CardContent>
      <div className="card-actions">
        <Button size="small" onClick={() => {/* Handle rent action */}}>Rent</Button>
        <Button size="small" onClick={() => {/* Handle details action */}}>Details</Button>
      </div>
    </Card>
  );
}

export default MovieCard;
