import React, { useEffect, useState } from 'react';
import MonsterSheet from './monsterSheet/monsterSheet';
import axios from 'axios';
import { useFormik } from 'formik';

const Character = (props) => {

    const [maxHitpoints, setmaxHitpoints] = useState(props.maxHitpoints);
    const [hitpoints, setHitpoints] = useState(props.hitpoints);
    const [showStats, setStats] = useState(false);
    const [name, setName] = useState(props.name)
    const [initiative, setInitiative] = useState(props.initiative)
    const [armorClass, setArmorClass] = useState(props.armorClass)
    const [concentration, setConcentration] = useState(props.concentration)
    const [editCharacter, setEditCharacter] = useState(false);

    const characterId = props.id;


    const hitpointsCounter = (operator) => {
        if (operator === "plus" && hitpoints < maxHitpoints) {
            setHitpoints(hitpoints + 1);
        }
        if (operator === "minus" && hitpoints > 0) {
            setHitpoints(hitpoints - 1);
        }
    }

    useEffect(() => {
        updateCharacter(name, hitpoints, initiative, armorClass, concentration, characterId)
    }, [name, hitpoints, initiative, armorClass, concentration, characterId])

    const updateCharacter = (name, hitpoints, initiative, armor_class, concentration, characterId) => {
        axios
            .patch(`http://${process.env.REACT_APP_API_URL}/character/${characterId}/`, {
                name, hitpoints, initiative, armor_class, concentration, characterId
            })
            .then((response) => {
                console.log(response.status)
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response)
                }
            })
    }

    const characterForm = useFormik({
        initialValues: {
            name: name,
            initiative: initiative,
            armorClass: armorClass
        },
        onSubmit: (values) => {
            setEditCharacter(!editCharacter);
            setInitiative(values.initiative);
            setArmorClass(values.armorClass);
            setName(values.name);
        }
    })

    return <div>

        <div className='character'>
            {editCharacter ?
                <form action="" onSubmit={characterForm.handleSubmit} className='characterForm'>
                    <input type="text" name="name" className='name'
                        value={characterForm.values.name} onChange={characterForm.handleChange} />
                    <input type="number" name="initiative" className='initiative'
                        value={characterForm.values.initiative} onChange={characterForm.handleChange} />
                    <input type="number" name="armorClass" className='armorClass'
                        value={characterForm.values.armorClass} onChange={characterForm.handleChange} />
                    <div>
                        <button type="submit">Save</button>
                    </div>
                </form> :
                <div className='editables'>
                    <div className='name'>
                        <h4>{name}</h4>
                    </div>
                    <div className='initiative'>
                        <h4>{initiative}</h4>
                    </div>
                    <div className="armorClass">
                        <h4>{armorClass}</h4>
                    </div>
                </div>}
            <div className='concentration'>
                <label className="switch">
                    <input type="checkbox" defaultChecked={concentration ? true : false}></input>
                    <span className="slider round" onClick={() => setConcentration(!concentration)}></span>
                </label>
            </div>
            <div className='hitpoints'>
                <svg className="count" version="1.1" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 32 32"
                    onClick={() => hitpointsCounter("minus")}>
                    <title>minus</title>
                    <path d="M0 13v6c0 0.552 0.448 1 1 1h30c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1h-30c-0.552 0-1 0.448-1 1z"></path>
                </svg>
                <h4>{`${hitpoints}/${maxHitpoints}`}</h4>
                <svg className="count" version="1.1" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 32 32"
                    onClick={() => hitpointsCounter("plus")}>
                    <title>plus</title>
                    <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
                </svg>
            </div>

            <svg className="small" id="down" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"
                onClick={() => setStats(!showStats)}>
                <title>circle-down</title>
                <path d="M32 16c0-8.837-7.163-16-16-16s-16 7.163-16 16 7.163 16 16 16 16-7.163 16-16zM3 16c0-7.18 5.82-13 13-13s13 5.82 13 13-5.82 13-13 13-13-5.82-13-13z"></path>
                <path d="M9.914 11.086l-2.829 2.829 8.914 8.914 8.914-8.914-2.828-2.828-6.086 6.086z"></path>
            </svg>
            <div className="icons">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"
                    onClick={() => setEditCharacter(!editCharacter)}>
                    <title>pencil</title>
                    <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                </svg>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className='cross'
                    onClick={props.delete} style={editCharacter ? { display: "none" } : { display: "inline-block" }}>
                    <title>cross</title>
                    <path d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
                </svg>
            </div>

        </div>


        <div style={showStats && props.statBlock ? { display: "block" } : { display: "none" }}>
            <MonsterSheet></MonsterSheet>
        </div>

    </div>

}

export default Character;