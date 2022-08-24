import interact from "interactjs";

const InteractionService = {


    setInteractable: function (componentState, componentName) {

        const state = componentState;
        let position = {
            x: 0,
            y: 0
        };

        if (localStorage.getItem(`${state.title}${componentName}position`) !== null) {
            let storagePosition = JSON.parse(localStorage.getItem(`${state.title}${componentName}position`));
            position = {
                x: storagePosition[0],
                y: storagePosition[1]
            };
        }

        let size = [];
        let pos = [];
        interact(`#${state.id}`)
            .resizable({
                edges: {
                    top: false,
                    left: false,
                    bottom: false,
                    right: true
                },
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent'
                    })
                ],
                listeners: {
                    move: function (event) {
                        //  let {x,y} = event.target.dataset;
                        let x = position.x;
                        let y = position.y;

                        x = (parseFloat(x) || 0) + event.deltaRect.left;
                        y = (parseFloat(y) || 0) + event.deltaRect.top;

                        Object.assign(event.target.style, {
                            width: `${event.rect.width}px`,
                            height: `${event.rect.height}px`,
                            transform: `translate(${x}px,${y}px)`
                        });
                        Object.assign(event.target.dataset, {
                            x,
                            y
                        });
                    },
                    end(event) {
                        size = [event.rect.width, event.rect.height];
                        localStorage.setItem(`${state.title}${componentName}size`, JSON.stringify(size));
                    }
                }
            })
            .draggable({
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent'
                    })
                ],
                listeners: {
                    start(event) {

                        let z = event.target.style.zIndex + 1;
                        if (event.target.style.zIndex !== "") {
                            z = parseInt(event.target.style.zIndex) + 1
                        }
                        event.target.style.zIndex =
                            `${z}`
                    },
                    move(event) {
                        position.x += event.dx
                        position.y += event.dy

                        event.target.style.transform =
                            `translate(${position.x}px, ${position.y}px)`
                    },
                    end(event) {
                        pos = [position.x, position.y];
                        localStorage.setItem(`${state.title}${componentName}position`, JSON.stringify(pos));
                    }
                }
            });

    },

    unsetInteractable: function (id) {
        interact(`#${id}`).unset();
    },

    setPosition: function (componentState, componentName) {
        let component = document.getElementById(componentState.id);
        let position = JSON.parse(localStorage.getItem(`${componentState.title}${componentName}position`));

        component.style.transform = `translate(${position[0]}px,${position[1]}px)`;
    },
    setSize: function (componentState, componentName) {
        let component = document.getElementById(componentState.id);
        let size = JSON.parse(localStorage.getItem(`${componentState.title}${componentName}size`));

        component.style.width = `${size[0]}px`;
        component.style.height = "auto";
    },
    setSizeandPosition: function (componentState, componentName) {
        if (localStorage.getItem(`${componentState.title}${componentName}size`) !== null) {
            this.setSize(componentState, componentName);
        }
        if (localStorage.getItem(`${componentState.title}${componentName}position`) !== null) {
            this.setPosition(componentState, componentName);
        }
    }

}

export default InteractionService;