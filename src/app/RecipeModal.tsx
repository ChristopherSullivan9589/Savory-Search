import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Fuse from 'fuse.js';

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

interface RecipeModalProps {
  recipeId: number;
  userIngredients: string[];
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipeId, userIngredients, onClose }) => {
  const [recipeDetails, setRecipeDetails] = useState<RecipeInfo | null>(null);

  // Fetch detailed recipe data when the modal opens
  useEffect(() => {
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=c41d78f9c3ad4c648c7dc1ae183fe9cb`)
      .then((response) => response.json())
      .then((data) => {console.log(data); setRecipeDetails(data)})
      .catch((error) => console.error('Error fetching recipe information:', error));
  }, [recipeId]);

  if (!recipeDetails) return <p>Loading...</p>;

  const isIngredientMissing = (ingredient: string) => {
    /*const lowerCaseIngredient = ingredient.toLowerCase().trim();
    return !userIngredients.some((userIngredient) => {
      const lowerCaseUserIngredient = userIngredient.toLowerCase().trim();
      return lowerCaseUserIngredient === lowerCaseIngredient;
    });
    */

    const fuse = new Fuse(userIngredients, { threshold: 0.3 }); // Adjust threshold as needed
    const result = fuse.search(ingredient.toLowerCase().trim());
    return result.length === 0; // If no matches found, return true (ingredient is missing)

  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h3>{recipeDetails.title}</h3>
        <Image src={recipeDetails.image} alt={recipeDetails.title} height={250} width={300} />
        
        <h4>Ingredients:</h4>
        <ul>
          {recipeDetails.extendedIngredients.map((ingredient) => (
            <li
              key={ingredient.id}
              style={{
                color: isIngredientMissing(ingredient.name) ? 'red' : 'green', 
                textTransform: 'capitalize',
                fontFamily: "sans-serif"
              }}
            >
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>

        <h4>Instructions:</h4>
        <ol>
          {recipeDetails.analyzedInstructions[0]?.steps.map((step) => (
            <li key={step.number}>{step.step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeModal;
