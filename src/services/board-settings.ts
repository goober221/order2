export const getNsfwMode = () => {
    return localStorage.getItem('nsfw') === "1";
}