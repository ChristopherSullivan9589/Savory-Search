import React, { useState, useEffect } from 'react';

interface RecipeDetailsProps {
  recipeId: number;
}

interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
}

interface RecipeInfo {
  title: string;
  image: string;
  extendedIngredients: Ingredient[];
  analyzedInstructions: { steps: { number: number; step: string }[] }[];
}

const RecipeDetails: React.FC<RecipeDetailsProps> = ({ recipeId }) => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeInfo | null>(null);

  useEffect(() => {
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=c41d78f9c3ad4c648c7dc1ae183fe9cb`)
      .then((response) => response.json())
      .then((data) => setRecipeDetails(data))
      .catch((error) => console.error('Error fetching recipe information:', error));
  }, [recipeId]);

  if (!recipeDetails) return <p>Loading...</p>;

  return (
    <div>
      <h4>Ingredients:</h4>
      <ul>
        {recipeDetails.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id}>
            {ingredient.amount} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>
      <h4>Instructions:</h4>
      <ol>
        {recipeDetails.analyzedInstructions[0].steps.map((step) => (
          <li key={step.number}>{step.step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeDetails;
