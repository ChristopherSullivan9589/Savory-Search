import React, { useState } from 'react'
import styles from "./page.module.css";
import Image from "next/image"
import RecipeDetails from './RecipeDetails';
import RecipeModal from './RecipeModal';

interface Recipe {
  id : number;
  title: string;
  image: string;
  missedIngredients: { id: number; name: string}[];
  usedIngredients: { id: number; name: string}[];
}

interface RecipeListProps {
  recipes: Recipe[];
  userIngredients: string[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes, userIngredients }) => {

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const openModal = (recipe: Recipe) => setSelectedRecipe(recipe);
  const closeModal = () => setSelectedRecipe(null);

  return (
    <div className={styles.recipesContainer}>
      <h3>Recipes:</h3>
      <ul>
        {recipes !== null &&
          recipes.map((recipe) => (
            <li key={recipe.id} className={styles.recipeItem}>
              <div onClick={() => openModal(recipe)} className={styles.recipeHeader}>
              <h4>{recipe.title}</h4>
              <Image src={recipe.image} width={300} height={300} alt={recipe.title} className={styles.recipeImage} />
            </div>
            </li>
          ))}
      </ul>

      {selectedRecipe && (
        <RecipeModal recipeId={selectedRecipe.id} userIngredients={userIngredients} onClose={closeModal} />
      )}
    </div>
  )
}

export default RecipeList
