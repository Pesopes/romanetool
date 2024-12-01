<main>
    <img class="logo" src="./logo_alt.svg" alt="Romanetool Logo" />
    <!-- <h1>Romanetool</h1> -->
    <p>A tool for making simple interactive stories.</p>
    <small>Pick your scenario and start.</small>
    <a class="play-link" href="./game">Choose a Scenario</a>
    <a class="about-link" href="/about">What is Romanetool?</a>
</main>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: "Arial", sans-serif;
        background: linear-gradient(120deg, #ffe4e1, #ffc37f);
        color: #2c2c2c;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
        gap: 1rem;
    }

    h1 {
        font-size: 3rem;
        margin: 0;
        color: #2c2c2c;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }

    p {
        font-size: 1.2rem;
        color: #444;
        max-width: 600px;
        margin: 0 1rem;
    }

    .logo {
        width: 350px;
        height: auto;
    }

    a {
        text-decoration: none;
        font-size: 1.5rem;
        font-weight: bold;
        color: rgb(45, 45, 45);
        background: #61fff7;
        padding: 0.8rem 2rem;
        border-radius: 25px;
        box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.2);
        transition:
            transform 0.2s ease,
            background 0.3s ease,
            color 0.3s;
    }

    a:hover {
        transform: scale(1.1);
        background: #ff3d3d;
    }

    a:active {
        transform: scale(0.95);
    }
    .play-link {
        font-size: 2rem;
    }
    .about-link {
        font-size: 1.2rem;
        color: #ff6f61;
        text-decoration: none;
        margin-top: 1.5rem;
        background: #95fffb;
    }

    .about-link:hover {
        color: #ff3d3d;
    }
    small {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #666;
    }
</style>
