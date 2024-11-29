import type { Tweened } from "svelte/motion"

export interface Background {
    src: string
    frame: string
    shaderCode: string
    ambientMusic: string
}

export interface Overlay {
    src: string
    title: string
    subtitle: string
    opacity: Tweened<number>
}