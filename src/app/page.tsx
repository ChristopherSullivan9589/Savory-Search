"use client";

import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "./page.module.css";
import React, {useEffect, useState } from "react";
import Link from "next/link"
import RecipeList from "./RecipeList";

interface Recipe {
  id : number;
  title: string;
  image: string;
  missedIngredients: { id: number; name: string}[];
  usedIngredients: { id: number; name: string}[];
}


export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredient, setIngredient] = useState(""); // Track single ingredient input
  const [ingredients, setIngredients] = useState([]); // Track all ingredients as an array


  function recipe() {
    const ingredientString = ingredients.join(","); // Join ingredients array to a string
    
    fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?apiKey=c41d78f9c3ad4c648c7dc1ae183fe9cb&ingredients=${ingredientString}&number=10`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data gotten:\n");
        console.log(data);

        setRecipes(data);
        //console.log("is this an array: " + Array.isArray(recipes))
      })
      .catch(() => {
        console.log("error");
      });
  }

  function filterExactRecipe(recipes){ //for recipe with just ingredients
    const exactRecipes = recipes.filter((recipe) => recipe.missedIngredientCount ==0);
    return exactRecipes;
  }

  function getFilteredRecipe() {
    const ingredientString = ingredients.join(","); // Join ingredients array to a string

  fetch(
    `https://api.spoonacular.com/recipes/findByIngredients?apiKey=c41d78f9c3ad4c648c7dc1ae183fe9cb&ingredients=${ingredientString}&number=10`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received:\n", data);

      const exactRecipes = filterExactRecipe(data);
      setRecipes(exactRecipes);
    })
    .catch(() => {
      console.log("Error fetching recipes");
    });
}
  

  function handleInputChange(e) {
    setIngredient(e.target.value); // Update single ingredient input
  }

  function handleKeyDown(e) {
    if (e.key == 'Enter'){
      e.preventDefault();
      handleSubmit(); 
    }
  }

  const handleSubmit = () => {
    if (ingredient.trim()){
      console.log("form submitted with", ingredient); 
      addIngredient(); 
    }
  }

  function addIngredient() {
    if (ingredient) {
      setIngredients([...ingredients, ingredient]); // Add input to ingredients array
      setIngredient(""); // Clear input field
    }
  }

  function clearIngredients(){
    setIngredient("");
    setIngredients([]);
  }

  return (
    <>
      <div>

        <div className="Section"></div>

        <p className={styles.title}>RecipeFinder</p>

        <div className={styles.flex}>
          <input
            type="text"
            placeholder="Add an ingredient"
            value={ingredient}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={styles.input}
          />

          <button className={styles.buttonAddClear} onClick={handleSubmit}>Add</button>

          <button className={styles.buttonAddClear} onClick={clearIngredients}>Clear</button>

          <button className={styles.buttonGet} onClick={recipe}>Get Recipes</button>

          <button className={styles.buttonFilter} onClick={getFilteredRecipe}> Filter Recipes</button>
        </div>

        

        <div className={styles.ingredientsContainer}>
          <h3>Ingredients:</h3>
          <ul>
            {ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        

        <div>
        <RecipeList recipes={recipes} userIngredients={ingredients} />
        </div>
      </div>
    </>
  );
}