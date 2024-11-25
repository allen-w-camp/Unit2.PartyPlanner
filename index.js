const COHORT = "2410-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

console.log(state);

const eventsList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

async function render() {
    await getEvents();
    renderEvents();
  }
  render();
  
  async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

render();

async function addEvent(event) {
    event.preventDefault();

  await createEvent(
    addEventForm.name.value,
    addEventForm.date.value,
    addEventForm.location.value,
    addEventForm.description.value,
  );
}
render();


async function createEvent(name, date, location, description) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            Headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name, date, location, description}),
        });
        const json = await response.json();
        console.log(json);
        render();
      } catch (error) {
        console.log(error) 
      }
    }

async function updateEvent(id, name, date, location, description) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, date, location, description }),
        });
        const json = await response.json();
    
        if (json.error) {
          throw new Error(json.message);
        }
    
        render();
      } catch (error) {
        console.error(error);
      }
    }

    async function deleteEvent(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });
        
            if(!response.ok) {
              throw new Error("Party could not be deleted");
            }
            render();
          } catch (error) {
            console.log(error)
          }
        }

        function renderEvents() {
            if (!state.events.length) {
            eventsList.innerHTML =
                /*html*/
                `<li>No parties found.</li>`;
              return;
            }
  const eventCards = state.events.map((event) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("event");
   eventCard.innerHTML = /*html*/ `
      <p>${event.name}</p>
      <p>${event.date}</p>
      <p>${event.location}</p>
      <p>${event.description}</p>
    `;
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Party";
    eventCard.append(deleteButton);
    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    return eventCard;
  });
  eventsList.replaceChildren(...eventCards);
}
render();