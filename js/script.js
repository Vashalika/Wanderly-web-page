document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =========================================
    // WANDERLY - PART A
    // Setup, Destination Data and Search
    // =========================================

    // 1. Helper Functions
    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    // 2. Destination Data
    const destinations = [
        {
            name: "Manali",
            type: "mountains",
            region: "Himachal Pradesh",
            price: 8999,
            duration: "3 Days / 2 Nights",
            description:
                "Discover mountain views, beautiful valleys and exciting adventures."
        },
        {
            name: "Goa",
            type: "beach",
            region: "India",
            price: 12499,
            duration: "4 Days / 3 Nights",
            description:
                "Relax on golden beaches and enjoy a memorable coastal escape."
        },
        {
            name: "Kashmir",
            type: "nature",
            region: "Jammu & Kashmir",
            price: 16999,
            duration: "5 Days / 4 Nights",
            description:
                "Experience peaceful valleys, scenic lakes and stunning mountains."
        },
        {
            name: "Jaipur",
            type: "heritage",
            region: "Rajasthan",
            price: 6999,
            duration: "2 Days / 1 Night",
            description:
                "Explore royal palaces, historic forts and colourful markets."
        }
    ];

    // 3. Toast Notification
    let toastTimer;

    function toast(message, type = "success") {
        let box = $(".wanderly-toast");

        if (!box) {
            box = document.createElement("div");
            box.className = "wanderly-toast";
            box.setAttribute("role", "status");
            box.setAttribute("aria-live", "polite");
            document.body.appendChild(box);
        }

        box.textContent = message;
        box.dataset.type = type;
        box.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            box.classList.remove("show");
        }, 3200);
    }

    // 4. Hero Search Elements
    const searchBox = $(".hero-search");
    const searchItems = $$(".search-item", searchBox || document);

    let destinationInput;
    let travelTypeSelect;

    // 5. Destination Search Input
    if (searchBox && searchItems[0]) {
        const oldText = $("p", searchItems[0]);

        if (oldText) {
            destinationInput = document.createElement("input");

            destinationInput.type = "text";
            destinationInput.className = "destination-input";
            destinationInput.placeholder = "Where do you want to go?";
            destinationInput.setAttribute(
                "aria-label",
                "Search for a destination"
            );
            destinationInput.setAttribute(
                "list",
                "wanderly-suggestions"
            );

            const suggestionList = document.createElement("datalist");
            suggestionList.id = "wanderly-suggestions";

            destinations.forEach(place => {
                const option = document.createElement("option");
                option.value = place.name;
                suggestionList.appendChild(option);
            });

            oldText.replaceWith(destinationInput);
            searchItems[0].appendChild(suggestionList);
        }
    }

    // 6. Travel Type Dropdown
    if (searchBox && searchItems[1]) {
        const oldText = $("p", searchItems[1]);

        if (oldText) {
            travelTypeSelect = document.createElement("select");

            travelTypeSelect.className = "travel-type-select";
            travelTypeSelect.setAttribute(
                "aria-label",
                "Choose a travel category"
            );

            const travelTypes = [
                ["all", "All Travel Types"],
                ["mountains", "Mountains"],
                ["beach", "Beach"],
                ["nature", "Nature"],
                ["heritage", "Heritage"]
            ];

            travelTypes.forEach(([value, label]) => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = label;
                travelTypeSelect.appendChild(option);
            });

            oldText.replaceWith(travelTypeSelect);
        }
    }

    // 7. Save Common Elements for Part B
    const destinationSection = $("#destinations");
    const destinationCards = $$(".destination-card");
    const packageCards = $$(".package-card");
    const exploreButton = $(".explore-btn");

    // Find destination data using a card's heading
    function getPlaceFromCard(card) {
        const name = $("h3", card)?.textContent.trim() || "";

        return destinations.find(place =>
            place.name.toLowerCase() === name.toLowerCase()
        );
    }
    // =========================================
    // PART B: FILTERING AND DESTINATION DETAILS
    // =========================================

    // 1. Filter destinations and packages
    function filterResults() {
        const query = (destinationInput?.value || "")
            .trim()
            .toLowerCase();

        const selectedType = travelTypeSelect?.value || "all";
        let destinationCount = 0;

        destinationCards.forEach(card => {
            const place = getPlaceFromCard(card);
            const name = $("h3", card)?.textContent.trim() || "";

            const matchesName =
                !query || name.toLowerCase().includes(query);

            const matchesType =
                selectedType === "all" ||
                place?.type === selectedType;

            const visible = matchesName && matchesType;
            card.hidden = !visible;

            if (visible) destinationCount++;
        });

        packageCards.forEach(card => {
            const title = $("h3", card)?.textContent.trim() || "";

            const place = destinations.find(item =>
                title.toLowerCase().includes(item.name.toLowerCase())
            );

            const matchesName =
                !query ||
                title.toLowerCase().includes(query) ||
                (place && place.name.toLowerCase().includes(query));

            const matchesType =
                selectedType === "all" ||
                place?.type === selectedType;

            card.hidden = !(matchesName && matchesType);
        });

        let resultMessage = $(".search-result-message");

        if (!resultMessage && searchBox) {
            resultMessage = document.createElement("p");
            resultMessage.className = "search-result-message";
            resultMessage.setAttribute("aria-live", "polite");
            searchBox.insertAdjacentElement("afterend", resultMessage);
        }

        if (resultMessage) {
            resultMessage.textContent =
                query || selectedType !== "all"
                    ? `${destinationCount} destination(s) found.`
                    : "";
        }

        return destinationCount;
    }

    // Update results as the user types or changes travel type
    destinationInput?.addEventListener("input", filterResults);
    travelTypeSelect?.addEventListener("change", filterResults);

    // Explore button
    exploreButton?.addEventListener("click", () => {
        const query = (destinationInput?.value || "").trim();
        const count = filterResults();

        if (count > 0) {
            destinationSection?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            toast("Your next adventure awaits!");
        } else {
            toast(
                query
                    ? "Destination not found. Try Manali, Goa, Kashmir or Jaipur."
                    : "No matching destination found. Try another travel type.",
                "error"
            );
        }
    });

    // Press Enter to search
    destinationInput?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            exploreButton?.click();
        }
    });

    // 2. Popup functions
    function closeModal() {
        $(".wanderly-modal")?.remove();
        document.body.classList.remove("modal-open");
    }

    function openModal(title, content) {
        closeModal();

        const modal = document.createElement("div");
        modal.className = "wanderly-modal";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.setAttribute("aria-label", title);

        const panel = document.createElement("div");
        panel.className = "wanderly-modal-panel";

        const closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "modal-close";
        closeButton.textContent = "×";
        closeButton.setAttribute("aria-label", "Close popup");

        const heading = document.createElement("h2");
        heading.textContent = title;

        const body = document.createElement("div");
        body.className = "modal-body";
        body.appendChild(content);

        panel.append(closeButton, heading, body);
        modal.appendChild(panel);
        document.body.appendChild(modal);
        document.body.classList.add("modal-open");

        closeButton.addEventListener("click", closeModal);

        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeModal();
            }
        });

        closeButton.focus();
    }

    // Close popup with Escape key
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeModal();
        }
    });

    // 3. Add View Details buttons to destination cards
    destinationCards.forEach(card => {
        const place = getPlaceFromCard(card);

        if (!place) return;

        // Prevent duplicate buttons if this code is initialized again
        if ($(".destination-details-btn", card)) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "destination-details-btn";
        button.textContent = "View Details";

        button.addEventListener("click", () => {
            const content = document.createElement("div");

            const region = document.createElement("p");
            region.textContent = `Region: ${place.region}`;

            const description = document.createElement("p");
            description.textContent = place.description;

            const duration = document.createElement("p");
            duration.textContent = `Duration: ${place.duration}`;

            const price = document.createElement("p");
            price.textContent =
                `Packages start from ₹${place.price.toLocaleString("en-IN")}`;

            const action = document.createElement("button");
            action.type = "button";
            action.className = "modal-action-btn";
            action.textContent = "Explore Packages";

            action.addEventListener("click", () => {
                closeModal();
                $("#packages")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            content.append(
                region,
                description,
                duration,
                price,
                action
            );

            openModal(`${place.name} Travel Guide`, content);
        });

        card.appendChild(button);
    });
// =========================================
    // PART C: WISHLIST AND PACKAGE ENQUIRY
    // =========================================

    // 1. Wishlist functions
    const wishlistKey = "wanderly-favourites";

    function readWishlist() {
        try {
            const data = JSON.parse(
                localStorage.getItem(wishlistKey) || "[]"
            );

            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    function writeWishlist(items) {
        try {
            localStorage.setItem(
                wishlistKey,
                JSON.stringify(items)
            );

            return true;
        } catch {
            toast(
                "Wishlist could not be saved in this browser.",
                "error"
            );

            return false;
        }
    }

    // 2. Add Save buttons to destination cards
    destinationCards.forEach(card => {
        const place = getPlaceFromCard(card);

        if (!place) return;

        // Prevent duplicate buttons
        if ($(".wishlist-btn", card)) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "wishlist-btn";
        button.setAttribute(
            "aria-label",
            `Save ${place.name} to wishlist`
        );

        function updateButton() {
            const saved = readWishlist().includes(place.name);

            button.textContent = saved ? "♥ Saved" : "♡ Save";
            button.classList.toggle("is-saved", saved);
            button.setAttribute(
                "aria-pressed",
                String(saved)
            );
        }

        button.addEventListener("click", () => {
            const items = readWishlist();
            const alreadySaved = items.includes(place.name);

            const updated = alreadySaved
                ? items.filter(name => name !== place.name)
                : [...items, place.name];

            if (writeWishlist(updated)) {
                updateButton();

                toast(
                    alreadySaved
                        ? `${place.name} removed from wishlist.`
                        : `${place.name} added to wishlist.`
                );
            }
        });

        card.appendChild(button);
        updateButton();
    });

    // 3. Package details popup
    packageCards.forEach(card => {
        const title =
            $("h3", card)?.textContent.trim() || "Travel Package";

        const place = destinations.find(item =>
            title.toLowerCase().includes(item.name.toLowerCase())
        );

        const priceText =
            $("strong", card)?.textContent.trim() || "Contact us";

        // Handle links that currently have href="#"
        $$('a[href="#"]', card).forEach(link => {
            link.addEventListener("click", event => {
                event.preventDefault();

                const content = document.createElement("div");

                const destination = document.createElement("p");
                destination.textContent = place
                    ? `Destination: ${place.name}`
                    : title;

                const price = document.createElement("p");
                price.textContent = `Package price: ${priceText}`;

                const duration = document.createElement("p");
                duration.textContent = place
                    ? `Duration: ${place.duration}`
                    : "Please enquire for trip duration.";

                const description = document.createElement("p");
                description.textContent = place
                    ? place.description
                    : "Contact us to learn more about this package.";

                const enquiryButton = document.createElement("button");
                enquiryButton.type = "button";
                enquiryButton.className = "modal-action-btn";
                enquiryButton.textContent = "Make an Enquiry";

                enquiryButton.addEventListener("click", () => {
                    closeModal();
                    showEnquiryForm(title, priceText);
                });

                content.append(
                    destination,
                    price,
                    duration,
                    description,
                    enquiryButton
                );

                openModal(title, content);
            });
        });
    });

    // 4. Create enquiry form
    function showEnquiryForm(packageName, packagePrice) {
        const form = document.createElement("form");
        form.className = "enquiry-form";

        const fields = [
            {
                label: "Your Name",
                name: "name",
                type: "text",
                placeholder: "Enter your full name"
            },
            {
                label: "Email Address",
                name: "email",
                type: "email",
                placeholder: "Enter your email address"
            },
            {
                label: "Travel Date",
                name: "date",
                type: "date",
                placeholder: ""
            },
            {
                label: "Number of Travellers",
                name: "travellers",
                type: "number",
                placeholder: "2"
            }
        ];

        fields.forEach(field => {
            const label = document.createElement("label");
            label.textContent = field.label;

            const input = document.createElement("input");
            input.type = field.type;
            input.name = field.name;
            input.required = true;
            input.placeholder = field.placeholder;

            if (field.name === "name") {
                input.minLength = 2;
                input.maxLength = 80;
            }

            if (field.name === "travellers") {
                input.min = "1";
                input.max = "50";
                input.value = "2";
            }

            if (field.name === "date") {
                const now = new Date();

                const today = new Date(
                    now.getTime() -
                    now.getTimezoneOffset() * 60000
                ).toISOString().split("T")[0];

                input.min = today;
            }

            label.appendChild(input);
            form.appendChild(label);
        });

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "modal-action-btn";
        submit.textContent = "Submit Enquiry";

        form.appendChild(submit);

        // 5. Validate and save enquiry
        form.addEventListener("submit", event => {
            event.preventDefault();

            if (!form.reportValidity()) return;

            const values = new FormData(form);

            const enquiry = {
                package: packageName,
                price: packagePrice,
                name: values.get("name"),
                email: values.get("email"),
                date: values.get("date"),
                travellers: Number(values.get("travellers")),
                submittedAt: new Date().toISOString()
            };

            try {
                const savedData = JSON.parse(
                    localStorage.getItem("wanderly-enquiries") || "[]"
                );

                const enquiries = Array.isArray(savedData)
                    ? savedData
                    : [];

                enquiries.push(enquiry);

                localStorage.setItem(
                    "wanderly-enquiries",
                    JSON.stringify(enquiries)
                );

                closeModal();

                toast(
                    "Enquiry saved successfully in this browser demo!"
                );
            } catch {
                toast(
                    "Enquiry could not be saved. Please try again.",
                    "error"
                );
            }
        });

        openModal("Plan Your Trip", form);
    }
// PART D: MOBILE MENU, SMOOTH SCROLL AND BACK TO TOP

// 1. Mobile navigation menu
const navbar = $(".navbar");
const navLinks = $(".nav-links");

if (navbar && navLinks && !$(".menu-toggle", navbar)) {
    const menuButton = document.createElement("button");

    menuButton.type = "button";
    menuButton.className = "menu-toggle";
    menuButton.textContent = "☰";
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.setAttribute("aria-expanded", "false");

    navbar.insertBefore(menuButton, navLinks);

    menuButton.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("menu-open");

        menuButton.textContent = isOpen ? "✕" : "☰";
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    // Close menu after clicking a navigation link
    $$("a", navLinks).forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("menu-open");
            menuButton.textContent = "☰";
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
        });
    });
}

// 2. Smooth scrolling for internal links
$$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href");

        // Ignore empty links and placeholder links
        if (!targetId || targetId === "#") {
            return;
        }

        const target = $(targetId);

        if (target) {
            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            // Update the URL hash without an abrupt jump
            if (window.location.hash !== targetId) {
                history.replaceState(null, "", targetId);
            }
        }
    });
});

// 3. Back-to-top button visibility
const backToTop = $(".back-to-top");

if (backToTop) {
    const updateBackToTop = () => {
        backToTop.classList.toggle(
            "is-visible",
            window.scrollY > 300
        );
    };

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();
}

// 4. Current year in footer, if a year placeholder exists
const yearElement = $("#current-year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
// PART E: CONTACT FORM, NEWSLETTER AND FINAL SETUP

// 1. Contact form validation
const contactForm = $("#contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        toast(
            "Form validated successfully! Connect a backend to send your message."
        );

        contactForm.reset();
    });
}

// 2. Newsletter subscription
const newsletterForm = $("#newsletter-form");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!newsletterForm.reportValidity()) {
            return;
        }

        const emailInput = $('input[type="email"]', newsletterForm);
        const email = emailInput?.value.trim();

        if (!email) {
            toast("Please enter a valid email address.", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            toast("Please enter a valid email address.", "error");
            return;
        }

        try {
            const saved = JSON.parse(
                localStorage.getItem("wanderly-newsletter") || "[]"
            );

            const subscribers = Array.isArray(saved) ? saved : [];

            if (
                subscribers.some(
                    item => item.toLowerCase() === email.toLowerCase()
                )
            ) {
                toast("This email is already subscribed.");
                return;
            }

            subscribers.push(email);

            localStorage.setItem(
                "wanderly-newsletter",
                JSON.stringify(subscribers)
            );

            toast("Newsletter subscription saved successfully!");
            newsletterForm.reset();
        } catch {
            toast("Could not save your subscription.", "error");
        }
    });
}

// 3. Footer: display current year
const footerYear = $("#current-year");

if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

// 4. Show a welcome message in the console
console.log("Welcome to Wanderly - Travel & Tourism Website!");
console.log("JavaScript loaded successfully.");
// PART F: ADVANCED BOOKING SYSTEM

// 1. Create a button to open the booking form
const bookingButton = document.createElement("button");

bookingButton.type = "button";
bookingButton.className = "booking-btn";
bookingButton.textContent = "Book Your Trip";

const heroSearch = $(".hero-search");

if (heroSearch && !$(".booking-btn", heroSearch)) {
    heroSearch.appendChild(bookingButton);
}

// 2. Create a unique demo booking ID
function createBookingId() {
    return "WRL-" + Date.now().toString(36).toUpperCase();
}

// 3. Open booking form
function openBookingForm(selectedDestination = "") {
    const form = document.createElement("form");
    form.className = "booking-form";

    const destinationLabel = document.createElement("label");
    destinationLabel.textContent = "Choose Destination";

    const destinationSelect = document.createElement("select");
    destinationSelect.name = "destination";
    destinationSelect.required = true;

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a destination";
    destinationSelect.appendChild(placeholder);

    destinations.forEach(place => {
        const option = document.createElement("option");
        option.value = place.name;
        option.textContent = place.name;

        if (
            place.name.toLowerCase() ===
            selectedDestination.toLowerCase()
        ) {
            option.selected = true;
        }

        destinationSelect.appendChild(option);
    });

    destinationLabel.appendChild(destinationSelect);

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Travel Date";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.name = "travelDate";
    dateInput.required = true;

    const today = new Date();
    dateInput.min = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    dateLabel.appendChild(dateInput);

    const travellersLabel = document.createElement("label");
    travellersLabel.textContent = "Number of Travellers";

    const travellersInput = document.createElement("input");
    travellersInput.type = "number";
    travellersInput.name = "travellers";
    travellersInput.min = "1";
    travellersInput.max = "50";
    travellersInput.value = "2";
    travellersInput.required = true;

    travellersLabel.appendChild(travellersInput);

    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Full Name";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "name";
    nameInput.minLength = 2;
    nameInput.maxLength = 80;
    nameInput.placeholder = "Enter your full name";
    nameInput.required = true;

    nameLabel.appendChild(nameInput);

    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email Address";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.placeholder = "Enter your email";
    emailInput.required = true;

    emailLabel.appendChild(emailInput);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "modal-action-btn";
    submitButton.textContent = "Confirm Demo Booking";

    form.append(
        destinationLabel,
        dateLabel,
        travellersLabel,
        nameLabel,
        emailLabel,
        submitButton
    );

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const formData = new FormData(form);
        const destinationName = formData.get("destination");
        const selectedPlace = destinations.find(
            place => place.name === destinationName
        );

        if (!selectedPlace) {
            toast("Please select a valid destination.", "error");
            return;
        }

        const booking = {
            id: createBookingId(),
            destination: selectedPlace.name,
            travelDate: formData.get("travelDate"),
            travellers: Number(formData.get("travellers")),
            name: formData.get("name").trim(),
            email: formData.get("email").trim(),
            estimatedPrice: selectedPlace.price *
                Number(formData.get("travellers")),
            status: "Demo booking saved",
            createdAt: new Date().toISOString()
        };

        try {
            const saved = JSON.parse(
                localStorage.getItem("wanderly-bookings") || "[]"
            );

            const bookings = Array.isArray(saved) ? saved : [];
            bookings.push(booking);

            localStorage.setItem(
                "wanderly-bookings",
                JSON.stringify(bookings)
            );

            const confirmation = document.createElement("div");

            const heading = document.createElement("h3");
            heading.textContent = "Booking Details Saved!";

            const details = document.createElement("p");
            details.textContent =
                `Booking ID: ${booking.id}`;

            const destination = document.createElement("p");
            destination.textContent =
                `Destination: ${booking.destination}`;

            const date = document.createElement("p");
            date.textContent =
                `Travel Date: ${booking.travelDate}`;

            const people = document.createElement("p");
            people.textContent =
                `Travellers: ${booking.travellers}`;

            const price = document.createElement("p");
            price.textContent =
                `Estimated Total: ₹${booking.estimatedPrice.toLocaleString("en-IN")}`;

            const note = document.createElement("p");
            note.textContent =
                "This is a demo booking. No payment or actual reservation has been made.";

            confirmation.append(
                heading,
                details,
                destination,
                date,
                people,
                price,
                note
            );

            openModal("Booking Confirmation", confirmation);
        } catch {
            toast(
                "Could not save booking. Browser storage may be unavailable.",
                "error"
            );
        }
    });

    openModal("Book Your Trip", form);
}

bookingButton.addEventListener("click", () => {
    openBookingForm();
});

// 4. Add a button to view saved wishlist destinations
const wishlistViewButton = document.createElement("button");

wishlistViewButton.type = "button";
wishlistViewButton.className = "wishlist-view-btn";
wishlistViewButton.textContent = "View Wishlist";

const navbarElement = $(".navbar");

if (navbarElement && !$(".wishlist-view-btn", navbarElement)) {
    navbarElement.appendChild(wishlistViewButton);
}

wishlistViewButton.addEventListener("click", () => {
    let savedNames = [];

    try {
        const saved = JSON.parse(
            localStorage.getItem("wanderly-favourites") || "[]"
        );

        savedNames = Array.isArray(saved) ? saved : [];
    } catch {
        toast("Could not read your wishlist.", "error");
        return;
    }

    const list = document.createElement("div");

    const heading = document.createElement("h3");
    heading.textContent = "Your Saved Destinations";
    list.appendChild(heading);

    if (savedNames.length === 0) {
        const message = document.createElement("p");
        message.textContent =
            "Your wishlist is empty. Use the Save button on a destination card.";
        list.appendChild(message);
    } else {
        savedNames.forEach(name => {
            const place = destinations.find(
                item => item.name === name
            );

            if (!place) return;

            const item = document.createElement("div");
            item.className = "wishlist-item";

            const title = document.createElement("p");
            title.textContent = `${place.name} — ₹${place.price.toLocaleString("en-IN")} per person`;

            const bookButton = document.createElement("button");
            bookButton.type = "button";
            bookButton.textContent = "Book This Trip";
            bookButton.className = "modal-action-btn";

            bookButton.addEventListener("click", () => {
                closeModal();
                openBookingForm(place.name);
            });

            item.append(title, bookButton);
            list.appendChild(item);
        });
    }

    openModal("My Wishlist", list);
});
});