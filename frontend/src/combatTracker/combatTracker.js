import './combatTracker.scss';
import React, { useState, useEffect } from "react";
import Character from './character/character'
import useSWR from 'swr';
import { fetcher } from "../utils/axios";
import { useFormik } from 'formik';
import axios from 'axios';


const CombatTracker = (props) => {

    const [title, setTitle] = useState(props.title);
    const [characterForm, setCharacterForm] = useState(false)
    const [editTitle, setEditTitle] = useState(false)
    const [ctId, setCtId] = useState(props.id)
    const [interact, setInteract] = useState(props.interact);
    const [htmlId, setHtmlId] = useState(/\s/g.test(props.title) ? props.title.replace(/\s/g, "_") : props.title)
    const [count, setCount] = useState(props.round);
    const [characters, setCharacters] = useState([])

    const characterData = useSWR(`/combat_tracker/character/${ctId}/`, fetcher, { refreshInterval: 1000 })


    useEffect(() => {
        if (editTitle === false) {
            interact.setSizeandPosition({ title: title, id: htmlId }, "CT")
            interact.setInteractable({ title: title, id: htmlId }, "CT")
        }
        if (editTitle === true) {
            interact.setSizeandPosition({ title: title, id: htmlId }, "CT")
            interact.unsetInteractable(htmlId)
        }
        setCharacters(characterData?.data)

        if (characterData?.data !== undefined && characterData?.data.length > 0) {
            setCharacters(characterData?.data.sort((a, b) => {
                if (a.initiative < b.initiative) {
                    return 1;
                }
                if (a.initiative > b.initiative) {
                    return -1;
                }
                return 0;
            }))
        }

        return () => {
            updateCombatTracker(title, count, "combatTracker", ctId);
        }
    }, [characterData, title, htmlId, interact, editTitle, count, ctId, characters])

    const addCharacter = (name, initiative, armor_class, hitpoints, max_hitpoints, combat_tracker) => {
        axios
            .post(`http://${process.env.REACT_APP_API_URL}/character/`,
                { name, initiative, armor_class, hitpoints, max_hitpoints, combat_tracker })
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                if (err) {
                    console.log(err.response.data)
                }
            })
    }

    const deleteCharacter = (characterId) => {
        axios
            .delete(`http://${process.env.REACT_APP_API_URL}/character/${characterId}/`,
                { data: { characterId } })
            .then((response) => {
                console.log(response)
            })
            .catch((err) => {
                if (err) {
                    console.log(err.response.data)
                }
            })
    }

    const updateCombatTracker = (title, round, component, componentId) => {
        axios
            .patch(`http://${process.env.REACT_APP_API_URL}/${component}/${componentId}/`, {
                title, round, componentId
            })
            .then((response) => {
                console.log(response.status)
            })
            .catch((err) => {
                if (err.response) {
                    console.log(err.response.data)
                }
            })
    }

    const counter = (operator) => {
        if (operator === "plus") {
            setCount(count + 1);
        }
        if (operator === "minus" && count > 1) {
            setCount(count - 1);
        }
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            initiative: 1,
            armor_class: 1,
            hitpoints: 1,
        },
        onSubmit: (values) => {
            setCharacterForm(!characterForm);
            addCharacter(values.name, values.initiative, values.armor_class, values.hitpoints, values.hitpoints, ctId);
        }
    })

    const titleForm = useFormik({
        initialValues: {
            title: title
        },
        onSubmit: (values) => {
            setEditTitle(!editTitle);
            console.log(values.title);

            if (localStorage.getItem(`${htmlId}CTsize`) !== null) {
                let size = JSON.parse(localStorage.getItem(`${htmlId}CTsize`))
                localStorage.setItem(`${values.title}CTsize`, JSON.stringify(size))
            }
            if (localStorage.getItem(`${htmlId}CTposition`) !== null) {
                let position = JSON.parse(localStorage.getItem(`${htmlId}CTposition`))
                localStorage.setItem(`${values.title}CTposition`, JSON.stringify(position))
            }

            localStorage.removeItem(`${htmlId}Notesize`)
            localStorage.removeItem(`${htmlId}Noteposition`)
            setTitle(values.title);
            updateCombatTracker(values.title, count, "combatTracker", ctId);

        }
    })


    return <div className="combat" id={htmlId}>

        {editTitle ?
            <form action="" className='mainTitles' onSubmit={titleForm.handleSubmit}>
                <input type="text" name="title" id="" value={titleForm.values.title}
                    onChange={titleForm.handleChange} />
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"
                    onClick={() => setEditTitle(!editTitle)}>
                    <title>pencil</title>
                    <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                </svg>
                <button type="submit">Save</button>
            </form>
            :
            <div className='mainTitles'>
                <h2>{title}</h2>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"
                    onClick={() => setEditTitle(!editTitle)}>
                    <title>pencil</title>
                    <path d="M27 0c2.761 0 5 2.239 5 5 0 1.126-0.372 2.164-1 3l-2 2-7-7 2-2c0.836-0.628 1.874-1 3-1zM2 23l-2 9 9-2 18.5-18.5-7-7-18.5 18.5zM22.362 11.362l-14 14-1.724-1.724 14-14 1.724 1.724z"></path>
                </svg>
            </div>
        }
        <div className='icons'>
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"
                onClick={props.delete}
                data-title={title} data-component="combatTracker">
                <title>bin2</title>
                <path d="M6 32h20l2-22h-24zM20 4v-4h-8v4h-10v6l2-2h24l2 2v-6h-10zM18 4h-4v-2h4v2z"></path>
            </svg>
        </div>
        <div className='counter'>
            <h2 className='mainTitles'>Round</h2>
            <svg className="count" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"
                onClick={() => counter("minus")}>
                <title>minus</title>
                <path d="M0 13v6c0 0.552 0.448 1 1 1h30c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1h-30c-0.552 0-1 0.448-1 1z"></path>
            </svg>
            <h2 id="count">{count}</h2>
            <svg className="count" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"
                onClick={() => counter("plus")}>
                <title>plus</title>
                <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
            </svg>
        </div>
        <div className="characters">
            <div className='head'>
                <h4>Name</h4>
                <h4>Initiative</h4>
                <h4>Armor Class</h4>
                <h4>Concentration</h4>
                <h4>HP</h4>
            </div>
            {characters === undefined ? <h4>...Loading</h4> :
                characters.map((character, i) => (
                    <Character key={character.name} name={character.name} initiative={character.initiative}
                        hitpoints={character.hitpoints} armorClass={character.armor_class} id={character.id}
                        statBlock={character.statblock} maxHitpoints={character.max_hitpoints}
                        concentration={character.concentration}
                        delete={() => deleteCharacter(character.id)}></Character>))
            }
            <div className="add">
                <div style={characterForm ? { display: "none" } : { display: "block" }}>
                    <h4>Add character</h4>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"
                        onClick={() => setCharacterForm(!characterForm)}>
                        <title>plus</title>
                        <path d="M31 12h-11v-11c0-0.552-0.448-1-1-1h-6c-0.552 0-1 0.448-1 1v11h-11c-0.552 0-1 0.448-1 1v6c0 0.552 0.448 1 1 1h11v11c0 0.552 0.448 1 1 1h6c0.552 0 1-0.448 1-1v-11h11c0.552 0 1-0.448 1-1v-6c0-0.552-0.448-1-1-1z"></path>
                    </svg>
                </div>
                <form action="" className='addCharacterForm' style={characterForm ? { display: "block" } : { display: "none" }}
                    onSubmit={formik.handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="" value={formik.values.name}
                        onChange={formik.handleChange} required />
                    <label htmlFor="initiative">Initiative</label>
                    <input type="number" name="initiative" id="" value={formik.values.initiative}
                        onChange={formik.handleChange} required />
                    <label htmlFor="armor_class">Armor Class</label>
                    <input type="number" name="armor_class" id="" value={formik.values.armor_class}
                        onChange={formik.handleChange} required />
                    <label htmlFor="hitpoints">Hitpoints</label>
                    <input type="number" name="hitpoints" id="" value={formik.values.hitpoints}
                        onChange={formik.handleChange} required />
                    <button type="submit">Save</button>
                    <button onClick={() => setCharacterForm(!characterForm)}>Cancel</button>
                </form>
            </div>
        </div>
    </div>

}


export default CombatTracker;