<script lang="ts">
  import type { ProfilePosition } from "./speaker";
  import { slide } from "svelte/transition";
  let {
    name,
    src,
    position,
    active = true,
    speaking = false,
  }: {
    name: string;
    src: string;
    position: ProfilePosition;
    active: boolean;
    speaking: boolean;
  } = $props();
</script>

{#key position}
  <div
    transition:slide
    class="profile {position} {speaking && active ? 'speaking' : ''}"
    style="opacity: {active ? 100 : 60}%"
  >
    <!--   <div class="name">{name}</div> -->
    <div class="profile-pic">
      <img {src} alt={name} />
    </div>
  </div>
{/key}

<style>
  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute; /* Position absolute for layout control */
    bottom: 0%;
  }
  .profile-pic {
    border-radius: 0%; /* Makes it circular */
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    width: 300px;
    height: 400px;
  }

  .profile.none .profile-pic img {
    opacity: 0%;
  }

  .profile.left {
    left: 10px;
  }

  .profile.left .profile-pic img {
    transform: scaleX(-1);
  }

  .profile.right {
    right: 10px;
  }

  .profile-pic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-pic:hover {
    transform: scale(1.01); /* Add a hover effect if desired */
  }
  .name {
    font-size: 3em;
  }

  /* Speak bob */
  .speaking {
    --speaking-rotation: 3deg;
    --speaking-bob: -15px;
  }
  @keyframes speaking-right {
    0%,
    100% {
      transform: translateY(0px) rotateZ(0deg);
    }
    50% {
      transform: translateY(var(--speaking-bob))
        rotateZ(var(--speaking-rotation));
    }
  }
  @keyframes speaking-left {
    0%,
    100% {
      transform: translateY(0px) rotateZ(0deg);
    }
    50% {
      transform: translateY(var(--speaking-bob))
        rotateZ(calc(-1 * var(--speaking-rotation)));
    }
  }
  .speaking.right {
    animation: speaking-right 250ms infinite;
  }
  .speaking.left {
    animation: speaking-left 250ms infinite;
  }
</style>
