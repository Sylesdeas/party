const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2602-DannyM";
const EVENTS_API = BASE + COHORT + "/events";
const GUESTS_API = BASE + COHORT + "/guests";
const RSVPS_API = BASE + COHORT + "/rsvps";

let events = [];
let selectedEvent;
let guests = [];
let rsvps = [];

async function getEvents() {
  try {
    const response = await fetch(EVENTS_API);
    const result = await response.json();
    events = result.data;
  } catch (error) {
    console.error(error);
  }
}

async function getEvent(id) {
  try {
    const response = await fetch(`${EVENTS_API}/${id}`);
    const result = await response.json();
    selectedEvent = result.data;
    render();
  } catch (error) {
    console.error(error);
  }
}

async function getGuests() {
  try {
    const response = await fetch(GUESTS_API);
    const result = await response.json();
    guests = result.data;
  } catch (error) {
    console.error(error);
  }
}

async function getRsvps() {
  try {
    const response = await fetch(RSVPS_API);
    const result = await response.json();
    rsvps = result.data;
  } catch (error) {
    console.error(error);
  }
}

function EventListItem(event) {
  const li = document.createElement("li");

  if (selectedEvent && selectedEvent.id === event.id) {
    li.classList.add("selected");
  }

  li.innerHTML = `
    <a href="#selected">${event.name}</a>
  `;

  li.addEventListener("click", () => getEvent(event.id));

  return li;
}

function EventList() {
  const ul = document.createElement("ul");
  ul.classList.add("lineup");
  const items = events.map(EventListItem);
  ul.replaceChildren(...items);
  return ul;
}

function EventDetails() {
  if (!selectedEvent) {
    const p = document.createElement("p");
    p.textContent = "Please select an event to learn more.";
    return p;
  }

  const section = document.createElement("section");
  section.classList.add("event");

  const eventRsvps = rsvps.filter((r) => r.eventId === selectedEvent.id);
  const attendingGuests = guests.filter((g) =>
    eventRsvps.some((r) => r.guestId === g.id),
  );

  let guestList = "<ul>";
  attendingGuests.forEach((g) => {
    guestList += `<li>${g.name}</li>`;
  });
  guestList += "</ul>";

  section.innerHTML = `
    <h3>${selectedEvent.name} #${selectedEvent.id}</h3>
    <p><strong>Date:</strong> ${selectedEvent.date}</p>
    <p><strong>Location:</strong> ${selectedEvent.location}</p>
    <p>${selectedEvent.description}</p>
    <h4>Guests Attending:</h4>
    ${attendingGuests.length ? guestList : "<p>No RSVPs yet.</p>"}
  `;

  return section;
}

function render() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <h1>Fullstack Convention Center</h1>
    <main>
      <section>
        <h2>Upcoming Events</h2>
        <EventList></EventList>
      </section>
      <section id="selected">
        <h2>Event Details</h2>
        <EventDetails></EventDetails>
      </section>
    </main>
  `;

  app.querySelector("EventList").replaceWith(EventList());
  app.querySelector("EventDetails").replaceWith(EventDetails());
}

async function init() {
  await getEvents();
  await getGuests();
  await getRsvps();
  render();
}

init();
