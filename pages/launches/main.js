"use strict"

const onLoad = async () => {
    const submitButton = document.getElementById('submit');

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const selectElement = document.getElementById('name'),
            selectedText = selectElement.selectedOptions[0].value,
            twitchElement = document.getElementById('twitch'),
            twitchValue = twitchElement.checked ? "on" : "off",
            responseElement = document.getElementById('response');

        const fetchRequest = await fetch(`/v2/launch/list?name=${selectedText}&twitch=${twitchValue}`, {
            credentials: "omit",
            headers: {
                "Accept": "*/*",
            },
            method: "GET"
        });

        const fetchResponse = await fetchRequest.text();
        
        responseElement.innerText = fetchResponse;
    });

    const fetchRequest = await fetch("/v2/launch/list", {
        credentials: "omit",
        headers: {
            "Accept": "*/*",
        },
        method: "GET"
    });
    const fetchResponse = await fetchRequest.json();
    
    const selectElement = document.getElementById('name');

    fetchResponse.forEach((name) => {
        const array = name.split(" - "),
              selectText = name; //`${array[0]} - ${array[1]}`;
        
        const optionElement = new Option(selectText, name);
        selectElement.appendChild(optionElement);
    });
}
