/* ==========================================
   WANDERLY - TRAVEL & TOURISM WEBSITE
   Interactive JavaScript
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // 1. Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                event.preventDefault();
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // 2. Destination search
    const searchBox = document.querySelector(".hero-search");
    const searchItems = searchBox
        ? searchBox.querySelectorAll(".search-item")
        : [];

    let destinationInput = null;
    let travelTypeSelect = null;

    // Turn the destination text into an input field
    if (searchItems.length > 0) {
        const destinationText = searchItems[0].querySelector("p");

        if (destinationText) {
            destinationInput = document.createElement("input");
            destinationInput.type = "text";
            destinationInput.placeholder = "Where do you want to go?";
            destinationInput.setAttribute("aria-label", "Search destination");
            destinationInput.className = "destination-input";
            destinationText.replaceWith(destinationInput);
        }
    }

    // Turn the travel-type text into a dropdown
    if (searchItems.length > 1) {
        const travelText = searchItems[1].querySelector("p");

        if (travelText) {
            travelTypeSelect = document.createElement("select");
            travelTypeSelect.className = "travel-type-select";
            travelTypeSelect.setAttribute("aria-label", "Select travel type");

            [
                ["", "Select travel type"],
                ["mountains", "Mountains"],
                ["beaches", "Beaches"],
                ["nature", "Nature"],
                ["culture", "Culture & Heritage"]
            ].forEach(function (item) {
                const option = document.createElement("option");
                option.value = item[0];
                option.textContent = item[1];
                travelTypeSelect.appendChild(option);
            });

            travelText.replaceWith(travelTypeSelect);
        }
    }

    // Search button functionality
    const exploreSearchButton = searchBox
        ? searchBox.querySelector(".explore-btn")
        : null;

    if (exploreSearchButton) {
        exploreSearchButton.addEventListener("click", function () {
            const destination = destinationInput
                ? destinationInput.value.trim().toLowerCase()
                : "";

            const travelType = travelTypeSelect
                ? travelTypeSelect.value
                : "";

            const destinationSection =
                document.querySelector("#destinations");

            const cards = document.querySelectorAll(
                "#destinations .destination-card"
            );

            if (!destination && !travelType) {
                if (destinationInput) {
                    destinationInput.focus();
                }
                alert("Please enter a destination or select a travel type.");
                return;
            }

            let matched = 0;

            cards.forEach(function (card) {
                const cardText = card.textContent.toLowerCase();
                const imageAlt = card.querySelector("img")
                    ? card.querySelector("img").alt.toLowerCase()
                    : "";

                const matchesDestination =
                    !destination ||
                    cardText.includes(destination) ||
                    imageAlt.includes(destination);

                const matchesType =
                    !travelType ||
                    (travelType === "mountains" &&
                        /manali|kashmir|mountain|hill/i.test(cardText + " " + imageAlt)) ||
                    (travelType === "beaches" &&
                        /goa|beach/i.test(cardText + " " + imageAlt)) ||
                    (travelType === "nature" &&
                        /kashmir|manali|nature|valley|mountain/i.test(cardText + " " + imageAlt)) ||
                    (travelType === "culture" &&
                        /jaipur|culture|heritage/i.test(cardText + " " + imageAlt));

                const isMatch = matchesDestination && matchesType;

                card.style.display = isMatch ? "" : "none";

                if (isMatch) matched++;
            });

            if (destinationSection) {
                destinationSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            if (matched === 0) {
                alert("No matching destination found. Try Goa, Manali, Kashmir or Jaipur.");

                // Restore all cards when no match is found
                cards.forEach(function (card) {
                    card.style.display = "";
                });
            }
        });
    }


    // 3. Mobile navigation toggle
    const navbar = document.querySelector(".navbar");
    const navLinks = navbar
        ? navbar.querySelector(".nav-links")
        : null;

    if (navbar && navLinks) {
        let menuButton = navbar.querySelector(".menu-toggle");

        if (!menuButton) {
            menuButton = document.createElement("button");
            menuButton.type = "button";
            menuButton.className = "menu-toggle";
            menuButton.textContent = "☰";
            menuButton.setAttribute("aria-label", "Toggle navigation");
            menuButton.setAttribute("aria-expanded", "false");
            navbar.appendChild(menuButton);
        }

        menuButton.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("menu-open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("menu-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.textContent = "☰";
            });
        });
    }


    // 4. Back-to-top button
    const backToTop = document.createElement("button");
    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "Back to top");
    document.body.appendChild(backToTop);

    function updateBackToTop() {
        backToTop.classList.toggle("show", window.scrollY > 400);
    }

    window.addEventListener("scroll", updateBackToTop);
    updateBackToTop();

    backToTop.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // 5. Reveal sections when scrolling
    const revealElements = document.querySelectorAll(
        ".section-heading, .destination-card, .package-card, " +
        ".feature-card, .gallery-item, .testimonial-card, .cta"
    );

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealElements.forEach(function (element) {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    }


    // 6. Automatically update copyright year
    const copyright = document.querySelector(".footer-bottom p");

    if (copyright) {
        copyright.innerHTML = copyright.innerHTML.replace(
            /©\s*\d{4}/,
            "© " + new Date().getFullYear()
        );
    }


    // 7. Explore buttons scroll to destinations
    document.querySelectorAll(".btn").forEach(function (button) {
        const text = button.textContent.toLowerCase();

        if (text.includes("explore destination")) {
            button.addEventListener("click", function (event) {
                const section = document.querySelector("#destinations");

                if (section) {
                    event.preventDefault();
                    section.scrollIntoView({ behavior: "smooth" });
                }
            });
        }

        if (text.includes("view package")) {
            button.addEventListener("click", function (event) {
                const section = document.querySelector("#packages");

                if (section) {
                    event.preventDefault();
                    section.scrollIntoView({ behavior: "smooth" });
                }
            });
        }
    });

    console.log("Wanderly JavaScript loaded successfully!");
});
