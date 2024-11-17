<script lang="ts">
    let { name, src, position }:{name:string,src:string,position:'left'|'right'} = $props();
</script>

<div class="profile {position}">
    <div class="name">{name}</div>
    <div class="profile-pic">
        <img {src} alt={name}/>
    </div>
</div>


<style>
    .profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute; /* Position absolute for layout control */
      top: 30%;

    }
    .profile-pic{
        border-radius: 50%; /* Makes it circular */
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        transition: all 0.2s ease-in-out;
    }
  
    .profile.left {
      left: 10px;
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
      transform: scale(1.1); /* Add a hover effect if desired */
    }

    .name{
        font-size: 3em;
    }
  </style>