<main>
    <a href="/" class="back-link">
        <img src="./icons/back.svg" alt="Romanetool Logo" />
        Back to Main Page
    </a>
    <h1>About Romanetool</h1>
    <div class="about-section">
        <h2>What is it?</h2>
        <p>
            Romanetool is an <a href="https://github.com/Pesopes/romanetool"
                >open-source</a
            >
            project developed using <a href="https://svelte.dev/">Svelte</a> and
            SvelteKit.
        </p>
        <p>
            Each story is organized in a tidy folder, containing the script and
            all related assets. The game engine then reads this script to bring
            the story to life for the player.
        </p>
        <p>
            While the project currently provides just one example scenario to
            help developers and writers understand the workflow, to add your own
            scenarios, you'll need to host your own instance of <a
                href="https://github.com/Pesopes/romanetool">Romanetool</a
            >.
        </p>
    </div>

    <div class="about-section">
        <h2>How It Came To Be</h2>
        <p>
            Romanetool was created as a bridge between minds, allowing anyone to
            share stories that were once limited only to your imagination.
        </p>
    </div>

    <div class="credits">
        <h2>Credits</h2>
        <h3>Sound effects</h3>
        <p>
            <a href="https://kenney.nl/assets/digital-audio"
                >Digital Audio Pack</a
            > by Kenney
        </p>
        <p>
            Intro music by <a
                href="https://pixabay.com/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=153277"
                >Universfield</a
            >
        </p>
        <h3>Example scenario assets</h3>
        <p>
            Sherlock (Benedict Cumberbatch) – Fat Les (<a
                href="https://creativecommons.org/licenses/by/2.0">CC BY 2.0</a
            >), via Wikimedia Commons (edited – removed background)
        </p>
        <p>
            Rimmer (Chris Barrie) – ...some guy (<a
                href="https://creativecommons.org/licenses/by/2.0">CC BY 2.0</a
            >), via Wikimedia Commons (edited – removed background)
        </p>
        <p>
            Dr. Watson (Martin Freeman) – Harald Krichel (<a
                href="https://creativecommons.org/licenses/by-sa/3.0"
                >CC BY-SA 3.0</a
            >), via Wikimedia Commons, modified and distributed under the same
            license
        </p>
        <p>
            Poirot – <a
                href="https://t.novaskin.me/88f57c7c2cd4e701ca7a5433a7eaaba617416e73521cd52b4377c6bc1a515fad"
                >original skin</a
            >, screenshot and edit by me
        </p>
    </div>
</main>

<style>
    main {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
    }

    h1 {
        font-size: 2.5rem;
        color: #2c2c2c;
        margin-bottom: 1rem;
    }

    h2 {
        font-size: 2rem;
        margin-top: 2rem;
        color: #333;
    }

    p {
        font-size: 1.1rem;
        color: #555;
        line-height: 1.6;
    }

    .credits {
        margin-top: 2rem;
        font-size: 1.1rem;
        color: #444;
    }

    .credits a {
        color: #ff6f61;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s;
    }

    .credits a:hover {
        color: #ff3d3d;
    }

    .about-section {
        margin-top: 3rem;
    }

    .about-section p {
        font-style: italic;
        color: #777;
    }

    .about-section .highlight {
        color: #ff6f61;
    }
    /* Back link styles */
    .back-link {
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        color: #ff6f61;
        text-decoration: none;
        margin-bottom: 1rem;
        transition: color 0.3s;
    }

    .back-link:hover {
        color: #ff3d3d;
    }

    .back-link img {
        width: 20px;
        margin-right: 0.5rem;
    }
</style>
