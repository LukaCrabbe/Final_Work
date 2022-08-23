import React,{useState} from "react";

const MonsterSheet =(props)=>{

return <div className="monsterSheet">
            <div className="left">
                <div className="nameSheet">
                    <h2>Goblin</h2>
                    <p>Small humanoid (Goblinoid), Neutral Evil</p>
                </div>
                <div className="hitpointsSheet">
                    <p><span>Armor Class</span>15 (leather armor, shield)</p>
                    <p><span>Hit Points</span>7 (2d6)</p>
                    <p><span>Speed</span>30 ft.</p>
                </div>
                <div className="abilityScores">
                    <div>
                        <h4>STR</h4>
                        <h4>DEX</h4>
                        <h4>CON</h4>
                        <h4>INT</h4>
                        <h4>WIS</h4>
                        <h4>CHA</h4>
                    </div>
                    <div>
                        <h4>8(-1)</h4>
                        <h4>14(+2)</h4>
                        <h4>10(+0)</h4>
                        <h4>10(+0)</h4>
                        <h4>8(-1)</h4>
                        <h4>8(-1)</h4>
                    </div>
                </div>
                <div className="skillsSheet">
                    <p><span>Skills</span>Stealth +6</p>
                    <p><span>Senses</span>Darkvision 60ft., Passive Perception</p>
                    <p><span>Languages</span>Common, Goblin</p>
                    <p><span>Nimble Escape</span>The goblin can take the Disengage or Hide action
                    as a bonus action on each of its turns</p>
                </div>
            </div>

            <div className="right">
                <div className="challenge">
                    <p><span>Challenge</span>1/4 (50xp)</p>
                    <p><span>Proficiency Bonus</span>+2</p>
                </div>
                <div className="actions">
                    <h2>Actions</h2>
                    <p><span>Scimitar</span>Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.</p>
                    <p><span>Shortbow</span>Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.</p>
                </div>
            </div>
       </div>

}

export default MonsterSheet;