import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css'; 

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Default search query
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    window.open(recipe.recipe.url, '_blank');
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        'https://api.edamam.com/api/recipes/v2',
        {
          params: {
            type: 'public',
            q: searchQuery,
            app_id: 'af0cb042', // Your app_id
            app_key: 'c52148fdd9f9782411ded7cb50d4ba91', // Your app_key
          },
        }
      );

      const normalizedQuery = searchQuery.toLowerCase().trim();
      const filteredResults = response.data.hits.filter(
        (hit) =>
          hit.recipe.label.toLowerCase().includes(normalizedQuery) ||
          hit.recipe.source.toLowerCase().includes(normalizedQuery)
      );

      setRecipes(filteredResults);
      setSelectedRecipe(null);

      if (filteredResults.length === 0) {
        setErrorMessage('Recipe not found');
      } else {
        setErrorMessage('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!searchQuery) {
      setErrorMessage('');
      setRecipes([]);
    }
  }, [searchQuery]);

  const handleReturnToInitial = () => {
    setSearchQuery('');
    setRecipes([]);
    setSelectedRecipe(null);
    setErrorMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <div className="app">
      <h1>Recipe Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Enter a recipe keyword"
        />
        <button type="submit">Search</button>
      </form>
      {errorMessage && <div className="error-box">{errorMessage}</div>}
      {recipes.length === 0 && !errorMessage && (
        <img src={require('./a.png')} alt="Initial" style={{ marginRight: '100px' }} />
      )}
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div
            className="recipe-card"
            key={recipe.recipe.uri}
            onClick={() => handleRecipeClick(recipe)}
          >
            <h2>{recipe.recipe.label}</h2>
            <p>{recipe.recipe.source}</p>
            <img src={recipe.recipe.image} alt={recipe.recipe.label} />
          </div>
        ))}
      </div>
      {selectedRecipe && (
        <div className="full-recipe-details">
          <h2>{selectedRecipe.recipe.label}</h2>
          {/* Render other full recipe details here */}
        </div>
      )}
      {searchQuery && (
        <button className="return-button" onClick={handleReturnToInitial}>
          Home Page
        </button>
      )}
    </div>
  );
};

export default App;
