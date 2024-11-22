<script lang="ts">
  import type { ProfilePosition } from "./speaker";

  let {
    name,
    src,
    position,
    active = true,
  }: {
    name: string;
    src: string;
    position: ProfilePosition;
    active: boolean;
  } = $props();
  import { fade } from "svelte/transition";
</script>

<div in:fade class="profile {position}" style="opacity: {active ? 100 : 60}%">
  <!--   <div class="name">{name}</div> -->
  <div class="profile-pic">
    <img {src} alt={name} />
  </div>
</div>

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
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    width: 300px;
    height: 400px;
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
</style>
