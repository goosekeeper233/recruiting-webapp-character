import React, { useState, useEffect } from "react";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts.js";

export default function CharacterSheet({
  characterId,
  characterData,
  onDataChange,
}) {
  const [initialAttributes, initialSelectedClass, initialSkills] = [
    Object.fromEntries(ATTRIBUTE_LIST.map((attr) => [attr, 10])),
    null,
    Object.fromEntries(SKILL_LIST.map((skill) => [skill.name, 0])),
  ];
  const [attributes, setAttributes] = useState(
    characterData.attributes || initialAttributes
  );
  const [selectedClass, setSelectedClass] = useState(
    characterData.selectedClass || initialSelectedClass
  );
  const [skills, setSkills] = useState(characterData.skills || initialSkills);

  useEffect(() => {
    onDataChange(characterId, { attributes, selectedClass, skills });
  }, [attributes, selectedClass, skills, characterId, onDataChange]);

  useEffect(() => {
    characterData.attributes && setAttributes(characterData.attributes);
    characterData.selectedClass && setSelectedClass(characterData.selectedClass);
    characterData.skills && setSkills(characterData.skills);
  }, [characterData]);

  return (
    <div>
      <h1>Character {characterId}</h1>
      <SkillCheck attributes={attributes} skills={skills} />
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <Attributes attributes={attributes} setAttributes={setAttributes} />
        <Classes
          attributes={attributes}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />
        {selectedClass && (
          <ClassMinimumRequirements className={selectedClass} />
        )}
        <Skills attributes={attributes} skills={skills} setSkills={setSkills} />
      </div>
    </div>
  );
}

const calculateModifier = (value) => Math.floor((value - 10) / 2);

const SkillCheck = ({attributes, skills}) => {
  const [skill, setSkill] = useState("");
  const [dc, setDc] = useState(0);
  const [randomNumber, setRandomNumber] = useState(0);
  const [result, setResult] = useState(false);

  const handleRoll = () => {
    const random = Math.floor(Math.random() * 20) + 1;
    const total = random + skills[skill] + calculateModifier(attributes[SKILL_LIST.find(s => s.name === skill).attributeModifier]);
    console.log("total", total);
    setRandomNumber(random);
    setResult(total >= dc);
  }

  return (
    <div>
      <h2>Skill Check</h2>
      <div>
        <label>Skill:</label>
        <select onChange={(e) => setSkill(e.target.value)}>
          {SKILL_LIST.map((skill) => (
            <option key={skill.name} value={skill.name}>
              {skill.name}
            </option>
          ))}
        </select>
        <label>DC:</label>
        <input
          type="number"
          value={dc}
          onChange={(e) => setDc(e.target.value)}
        />
        <button onClick={handleRoll}>Roll</button>
      </div>
      <div>
        <p>Random Number: {randomNumber}</p>
        <p>Result: {result ? "Success" : "Failure"}</p>
      </div>
    </div>
  );
};

const Attributes = ({ attributes, setAttributes }) => {
  const handleIncrementAttributes = (attribute) => {
    const totalPoints = Object.values(attributes).reduce(
      (sum, value) => sum + value,
      0
    );
    if (totalPoints >= 70) {
      alert("A Character can have up to 70 Delegated Attribute Points");
      return;
    }
    setAttributes((prev) => ({ ...prev, [attribute]: prev[attribute] + 1 }));
  };

  const handleDecrementAttributes = (attribute) => {
    setAttributes((prev) => ({
      ...prev,
      [attribute]: Math.max(1, prev[attribute] - 1),
    }));
  };

  console.log("attributes", attributes);

  return (
    <div style={sectionStyle}>
      <h2>Attributes</h2>
      {ATTRIBUTE_LIST.map((attribute) => (
        <div key={attribute} style={{ marginBottom: "10px" }}>
          {attribute}: {attributes[attribute]} (modifier:{" "}
          {calculateModifier(attributes[attribute])})
          <button onClick={() => handleIncrementAttributes(attribute)}>
            +
          </button>{" "}
          <button onClick={() => handleDecrementAttributes(attribute)}>
            -
          </button>
        </div>
      ))}
    </div>
  );
};

const Classes = ({ attributes, selectedClass, setSelectedClass }) => {
  const classes = Object.keys(CLASS_LIST);

  const meetsRequirements = (className) => {
    const requirements = CLASS_LIST[className];
    return ATTRIBUTE_LIST.every(
      (attribute) => attributes[attribute] >= requirements[attribute]
    );
  };

  return (
    <div style={{ ...sectionStyle, maxWidth: "100px" }}>
      <h2>Classes</h2>
      {classes.map((className) => (
        <div
          key={className}
          style={{
            color: meetsRequirements(className) ? "red" : "inherit",
            marginBottom: "5px",
          }}
          onClick={() => {
            setSelectedClass(selectedClass === className ? null : className);
          }}
        >
          {className}
        </div>
      ))}
    </div>
  );
};

const ClassMinimumRequirements = ({ className }) => {
  const requirements = CLASS_LIST[className];
  return (
    <div style={sectionStyle}>
      <h2>{className} Minimum Requirements</h2>
      {ATTRIBUTE_LIST.map((attribute) => (
        <div key={attribute}>
          {attribute}: {requirements[attribute]}
        </div>
      ))}
    </div>
  );
};

const Skills = ({ attributes, skills, setSkills }) => {
  const availableSkillPoints = Math.max(
    0,
    10 + 4 * calculateModifier(attributes.Intelligence)
  );

  const usedSkillPoints = Object.values(skills).reduce(
    (sum, value) => sum + value,
    0
  );

  const handleIncrementSkill = (skillName) => {
    if (usedSkillPoints < availableSkillPoints) {
      setSkills((prevSkills) => ({
        ...prevSkills,
        [skillName]: prevSkills[skillName] + 1,
      }));
    } else {
      alert("You need more skill points! Upgrade intelligence to get more!");
    }
  };

  const handleDecrementSkill = (skillName) => {
    setSkills((prevSkills) => ({
      ...prevSkills,
      [skillName]: prevSkills[skillName] - 1,
    }));
  };

  return (
    <div style={{ ...sectionStyle, flex: 2 }}>
      <h2>Skills</h2>
      <div style={{ marginBottom: "10px" }}>
        Total Skill Points Available: {availableSkillPoints}
      </div>
      {SKILL_LIST.map((skill) => (
        <div key={skill.name} style={{ marginBottom: "5px" }}>
          {skill.name}: {skills[skill.name]} (Modifier:{" "}
          {skill.attributeModifier}):{" "}
          {calculateModifier(attributes[skill.attributeModifier])}{" "}
          <button onClick={() => handleIncrementSkill(skill.name)}>+</button>{" "}
          <button onClick={() => handleDecrementSkill(skill.name)}>-</button>{" "}
          total:{" "}
          {skills[skill.name] +
            calculateModifier(attributes[skill.attributeModifier])}
        </div>
      ))}
    </div>
  );
};

const sectionStyle = {
  flex: 1,
  minWidth: "50px",
  padding: "10px",
  margin: "5px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};
