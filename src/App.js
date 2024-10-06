import React, { useState, useCallback } from "react";
import "./App.css";
import CharacterSheet from "./CharacterSheet.js";
import { saveCharacters, getCharacters } from "./api.js";

function App() {
  const [characters, setCharacters] = useState([{ id: 1, data: {} }]);

  const addCharacter = () => {
    setCharacters((prevCharacters) => [
      ...prevCharacters,
      { id: prevCharacters.length + 1, data: {} },
    ]);
  };

  const resetAllCharacters = () => {
    setCharacters([]);
  };

  const saveAllCharacters = async () => {
    try {
      await saveCharacters(characters);
    } catch (error) {
      console.error("Failed to save characters:", error);
    }
  };

  const fetchCharacters = async () => {
    try {
      const fetchedCharacters = await getCharacters();
      console.log("FetchedCharacters:", fetchedCharacters);
      setCharacters(fetchedCharacters);
    } catch (error) {
      console.error("Failed to fetch characters:", error);
    }
  };

  const handleCharacterDataChange = useCallback((characterId, data) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((char) =>
        char.id === characterId ? { ...char, data } : char
      )
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
          <button onClick={addCharacter}>Add New Character</button>
          <button onClick={resetAllCharacters}>Reset All Characters</button>
          <button onClick={saveAllCharacters}>Save All Characters</button>
          <button onClick={fetchCharacters}>Fetch Characters</button>
        </div>
        {characters.map((character) => (
          <CharacterSheet
            key={character.id}
            characterId={character.id}
            characterData={character.data}
            onDataChange={handleCharacterDataChange}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
