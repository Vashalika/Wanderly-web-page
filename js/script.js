document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =========================================
    // WANDERLY - ADVANCED WEBSITE JAVASCRIPT
    // =========================================

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

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

    // =========================================
    // 1. NOTIFICATION / TOAST MESSAGES
    // =========================================

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

    // =========================================
    // 2. DYNAMIC DESTINATION SEARCH
    // =========================================

    const searchBox = $(".hero-search");
    const searchItems = $$(".search-item", searchBox || document);

    let destinationInput;
    let travelTypeSelect;

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
            destinationInput.setAttribute("list", "wanderly-suggestions");

            const list = document.createElement("datalist");
            list.id = "wanderly-suggestions";

            destinations.forEach(place => {
                const option = document.createElement("option");
                option.value = place.name;
                list.appendChild(option);
            });

            oldText.replaceWith(destinationInput);
            searchItems[0].appendChild(list);
        }
    }

    if (searchBox && searchItems[1]) {
        const oldText = $("p", searchItems[1]);

        if (oldText) {
            travelTypeSelect = document.createElement("select");
            travelTypeSelect.className = "travel-type-select";
            travelTypeSelect.setAttribute(
                "aria-label",
                "Choose a travel category"
            );

            [
                ["all", "All Travel Types"],
                ["mountains", "Mountains"],
                ["beach", "Beach"],
                ["nature", "Nature"],
                ["heritage", "Heritage"]
            ].forEach(([value, label]) => {
                const option = document.createElement("option");
                option.value = value;
                option.textContent = label;
                travelTypeSelect.appendChild(option);
            });

            oldText.replaceWith(travelTypeSelect);
        }
    }

    // =========================================
    // 3. FILTER DESTINATIONS AND PACKAGES
    // =========================================

    const destinationSection = $("#destinations");
    const destinationCards = $$(".destination-card");
    const packageCards = $$(".package-card");

    function getPlaceFromCard(card) {
        const name = $("h3", card)?.textContent.trim();

        return destinations.find(place =>
            place.name.toLowerCase() === (name || "").toLowerCase()
        );
    }

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
                place?.name.toLowerCase().includes(query);

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
            resultMessage.textContent = query || selectedType !== "all"
                ? `${destinationCount} destination(s) found.`
                : "";
        }

        return destinationCount;
    }

    destinationInput?.addEventListener("input", filterResults);
    travelTypeSelect?.addEventListener("change", filterResults);

    const exploreButton = $(".explore-btn");

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
                    : "Please choose a destination or travel type.",
                "error"
            );
        }
    });

    destinationInput?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            exploreButton?.click();
        }
    });

    // =========================================
    // 4. DESTINATION DETAILS POPUP
    // =========================================

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
            if (event.target === modal) closeModal();
        });

        closeButton.focus();
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeModal();
    });

    destinationCards.forEach(card => {
        const place = getPlaceFromCard(card);

        if (!place) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "destination-details-btn";
        button.textContent = "View Details";

        button.addEventListener("click", () => {
            const content = document.createElement("div");

            const region = document.createElement("p");
            region.textContent = place.region;

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
                $("#packages")?.scrollIntoView({ behavior: "smooth" });
            });

            content.append(region, description, duration, price, action);
            openModal(`${place.name} Travel Guide`, content);
        });

        card.appendChild(button);
    });

    // =========================================
    // 5. WISHLIST / SAVE FAVOURITES
    // =========================================

    const wishlistKey = "wanderly-favourites";

    function readWishlist() {
        try {
            const data = JSON.parse(localStorage.getItem(wishlistKey));
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    function writeWishlist(items) {
        try {
            localStorage.setItem(wishlistKey, JSON.stringify(items));
            return true;
        } catch {
            toast("Wishlist could not be saved in this browser.", "error");
            return false;
        }
    }

    destinationCards.forEach(card => {
        const place = getPlaceFromCard(card);
        if (!place) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "wishlist-btn";
        button.setAttribute("aria-label", `Save ${place.name} to wishlist`);

        function updateButton() {
            const saved = readWishlist().includes(place.name);
            button.textContent = saved ? "♥ Saved" : "♡ Save";
            button.classList.toggle("is-saved", saved);
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

    // =========================================
    // 6. PACKAGE DETAILS AND ENQUIRY
    // =========================================

    packageCards.forEach(card => {
        const title = $("h3", card)?.textContent.trim() || "Travel Package";
        const place = destinations.find(item =>
            title.toLowerCase().includes(item.name.toLowerCase())
        );

        const priceText = $("strong", card)?.textContent.trim() || "Contact us";

        // Handle package links without real booking backend
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

                const enquiryButton = document.createElement("button");
                enquiryButton.type = "button";
                enquiryButton.className = "modal-action-btn";
                enquiryButton.textContent = "Make an Enquiry";

                enquiryButton.addEventListener("click", () => {
                    closeModal();
                    showEnquiryForm(title, priceText);
                });

                content.append(destination, price, duration, enquiryButton);
                openModal(title, content);
            });
        });
    });

    function showEnquiryForm(packageName, packagePrice) {
        const form = document.createElement("form");
        form.className = "enquiry-form";

        const fields = [
            {
                label: "Your name",
                name: "name",
                type: "text",
                placeholder: "Enter your full name"
            },
            {
                label: "Email address",
                name: "email",
                type: "email",
                placeholder: "Enter your email"
            },
            {
                label: "Travel date",
                name: "date",
                type: "date",
                placeholder: ""
            },
            {
                label: "Number of travellers",
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

            if (field.name === "travellers") {
                input.min = "1";
                input.max = "50";
                input.value = "2";
            }

            if (field.name === "date") {
                const today = new Date();
                const localToday = new Date(
                    today.getTime() - today.getTimezoneOffset() * 60000
                ).toISOString().split("T")[0];

                input.min = localToday;
            }

            label.appendChild(input);
            form.appendChild(label);
        });

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.className = "modal-action-btn";
        submit.textContent = "Submit Enquiry";

        form.appendChild(submit);

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
                travellers: values.get("travellers")
            };

            // Demo only: save locally in this browser.
            try {
                const enquiries = JSON.parse(
                    localStorage.getItem("wanderly-enquiries") || "[]"
                );

                enquiries.push({
                    ...enquiry,
                    submittedAt: new Date().toISOString()
                });

                localStorage.setItem(
                    "wanderly-enquiries",
                    JSON.stringify(enquiries)
                );

                closeModal();
                toast("Enquiry saved in this browser demo!");
            } catch {
                toast("Enquiry could not be saved. Please try again.", "error");
            }
        });

        openModal("Plan Your Trip", form);
    }

    // =========================================
    // 7. MOBILE NAVIGATION MENU
    // =========================================

    const navbar = $(".navbar");
    const navLinks = $(".nav-links", navbar || document);

    if (navbar && navLinks) {
        let menuButton = $(".menu-toggle", navbar);

        if (!menuButton) {
            menuButton = document.createElement("button");
            menuButton.type = "button";
            menuButton.className = "menu-toggle";
            menuButton.textContent = "☰";
            menuButton.setAttribute("aria-label", "Toggle navigation");
            menuButton.setAttribute("aria-expanded", "false");

            navbar.insertBefore(menuButton, navLinks);
        }

        menuButton.addEventListener("click", () => {
            const open = navLinks.classList.toggle("menu-open");

            menuButton.textContent = open ? "✕" : "☰";
            menuButton.setAttribute("aria-expanded", String(open));
        });

        $$("a", navLinks).forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("menu-open");
                menuButton.textContent = "☰";
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // =========================================
    // 8. SMOOTH SCROLL FOR INTERNAL LINKS
    // =========================================

    $$('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = $(href);

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    beha